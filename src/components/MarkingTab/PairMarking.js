import React, { useState, useEffect, useRef } from 'react';
import {SolutionsService} from "../../services/solutionsService";
import {EventsService} from "../../services/eventService";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import Loader from "../Loader";
import {InputTextarea} from "primereact/inputtextarea";
import {Dropdown} from "primereact/dropdown";
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";

const PairMarking = ({ eventId }) => {
  const [pair, setPair] = useState({});
  const [solutions, setSolutions] = useState([]);
  const [criterias, setCriterias] = useState([]);
  const [option, setOption] = useState('even');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({
    show: false,
    updated: []
  })
  const ref = useRef(null);

  const options = [
    { name: 'Левое решение лучше', code: 'left' },
    { name: 'Решения равны', code: 'even' },
    { name: 'Правое решение лучше', code: 'right' }
  ]

  const fetch = () => {
    setLoading(true);
    SolutionsService.getNextPairByEvent(eventId)
      .then((res) => {
        setPair(res);
        if (!res.all_marked) {
          const first = SolutionsService.getSolution(res.first_solution_id);
          const second = SolutionsService.getSolution(res.second_solution_id);
          Promise.all([first, second])
            .then((res) => setSolutions(res))
            .finally(() => setLoading(false))
        }
      })
      .finally(() => setLoading(false))
  }

  const startMarking = () => {
    SolutionsService.startMarking(eventId)
      .then((res) => {
        fetch();
      })
  }

  useEffect(() => {
    const pairRequest = SolutionsService.getNextPairByEvent(eventId);
    const criteriasRequest = EventsService.getCriterias();
    Promise.all([pairRequest, criteriasRequest])
      .then(([pairResponse, criteriasResponse]) => {
        setCriterias(criteriasResponse.criterias);
        setPair(pairResponse);
        if (!pairResponse.all_marked) {
          const first = SolutionsService.getSolution(pairResponse.first_solution_id);
          const second = SolutionsService.getSolution(pairResponse.second_solution_id);
          Promise.all([first, second])
            .then((res) => setSolutions(res))
            .finally(() => setLoading(false))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const saveMark = () => {
    const data = {
      ...pair,
      score: function () {
        switch (option) {
          case "even":
            return 1
          case "left":
            return 2
          case "right":
            return 0
        }
      }()
    }
    SolutionsService.savePairMark(data)
      .then((res) => {
        if (res.error) {
          ref.current.show({ severity: 'error', summary: 'Ошибка!', detail: `${res.error}: ${res.message}`, life: 3000 })
        }
        else {
          setDialog({
            show: true,
            updated: res.automatically_updated_marks
          })
          ref.current.show({ severity: 'success', summary: 'Отлично!', detail: 'Оценка сохранена', life: 3000 })
        }
      })
  }

  if (loading) {
    return <Loader />
  }

  if (!pair)
    return <Button label='Начать оценку' className='my-5' onClick={startMarking} />

  if (pair.all_marked) {
    return <span>Вы завершили оценку этого мероприятия!</span>
  }

  return <div>
    <Toast ref={ref} position='top-right' />
    <Dialog onHide={() => { setDialog({ show: false, updated: [] }); fetch(); }} visible={dialog.show}>
      <h3 className='mt-0'>Автоматически обновленные пары:</h3>
      <div className='flex flex-column'>
        {dialog.updated.map((el) => {
          const result = function () {
            switch (el.score) {
              case 1:
                return "even"
              case 2:
                return "left"
              case 0:
                return "right"
            }
          }();
          return (
            <div className='flex align-items-center' key={el.pairing_mark_id}>
              <span className='block my-2 text'>Решение №{el.first_solution_id}</span>
              <span className='block mx-4 font-bold'>
                {options.find((el) => el.code === result).name}
              </span>
              <span className='block my-2 text'>Решение №{el.second_solution_id}</span>
            </div>
          )
        })}
        {dialog.updated.length === 0 && <span className='block'>Ни одна пара не была автоматически оценена</span> }
        <Button className='mt-3' label='Получить следующую пару' onClick={() => { setDialog({ show: false, updated: [] }); fetch(); }}/>
      </div>
    </Dialog>
    <h2 className='mb-1'>Критерий оценивания: {criterias.find(el => el.criteria_id === pair.criteria_id)?.name}</h2>
    <span className='text font-light text-sm block'>
      {criterias.find(el => el.criteria_id === pair.criteria_id).description}
    </span>
    <div className='flex px-5'>
      <div className='flex flex-column flex-grow-1'>
        <h2>Решение №{solutions[0]?.solution_id}</h2>
        <div className='flex flex-column align-content-start mb-4'>
          <label htmlFor="url" className="text-left mb-2">URL</label>
          <InputText
            id='url'
            readOnly
            placeholder='Ссылка на решение'
            value={solutions[0]?.url}
          />
        </div>
        <div className='flex flex-column align-content-start mb-4'>
          <label htmlFor="description" className="text-left mb-2">Описание решениея</label>
          <InputTextarea
            id='description'
            readOnly
            placeholder='Описание решения'
            value={solutions[0]?.description}
          />
        </div>
      </div>
      <div className='flex flex-column justify-content-center w-3 mx-5'>
        <Dropdown options={options} value={option} optionValue='code' optionLabel='name' onChange={(e) => setOption(e.value)} />
      </div>
      <div className='flex flex-column flex-grow-1'>
        <h2>Решение №{solutions[1]?.solution_id}</h2>
        <div className='flex flex-column align-content-start mb-4'>
          <label htmlFor="url" className="text-left mb-2">URL</label>
          <InputText
            id='url'
            readOnly
            placeholder='Ссылка на решение'
            value={solutions[1]?.url}
          />
        </div>
        <div className='flex flex-column align-content-start mb-4'>
          <label htmlFor="description" className="text-left mb-2">Описание решениея</label>
          <InputTextarea
            id='description'
            readOnly
            placeholder='Описание решения'
            value={solutions[1]?.description}
          />
        </div>
      </div>
    </div>
    <Button label='Сохранить оценку' onClick={saveMark} />
  </div>
}

export default PairMarking;