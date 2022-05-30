import React, {useEffect, useState} from 'react';
import {AuthService} from "../../services/authService";
import {SolutionsService} from "../../services/solutionsService";
import {EventsService} from "../../services/eventService";
import Loader from "../Loader";
import CriteriaTable from "./CriteriaTable";
import PairTable from "./PairTable";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Dropdown} from "primereact/dropdown";

const ResultsTab = ({ event }) => {
  const [type, setType] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [criterias, setCriterias] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const user = AuthService.getUser();
    if (user.roles.find((el) => el.name === 'admin' || el.name ==='administrator')) {
      EventsService.getAllStaff()
        .then((res) => {
          if (res.error) {}
          else {
            setStaff(res.staff)
            setSelectedStaff(res.staff[0]?.id)
          }
        })
        .finally(() => {
          if (event.evaluation_method === 'simple')
            setType('simple_full')
          else setType('pair_full')
        })
    }
    else {
      if (event.evaluation_method === 'simple')
        setType('simple')
      else setType('pair')
    }
    const solutionsRequest = SolutionsService.getSolutionsByEvent(event.event_id);
    const criteriasRequest = EventsService.getCriterias();
    Promise.all([solutionsRequest, criteriasRequest])
      .then(([solutionsResponse, criteriasResponse]) => {
        setCriterias(criteriasResponse.criterias);
        setSolutions(solutionsResponse.solutions);
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loader />
  }


  const renderMarking = () => {
    const user = AuthService.getUser();
    const options = staff.map((el) => {
      return {
        id: el.id,
        title: `${el.person.surname} ${el.person.name} ${el.person.patronymic || ''}`
      }
    })
    switch (type) {
      case 'forbidden':
        return <span className='text font-italic'>Вы не являетесь экспертом, оценивание запрещено</span>
      case 'simple_full':
        return (
          <>
            <Dropdown
              options={options}
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.value)}
              optionLabel='title'
              optionValue='id'
              className='my-3 w-25rem'
            />
            <CriteriaTable
              criterias={criterias}
              marks={solutions.reduce((acc, el) => {
                return [...acc, ...el.marks.filter((elem) => elem.staff_id === selectedStaff)]
              }, [])}
            />
          </>
        )
      case 'pair_full':
        return (
          <>
            <Dropdown
              options={options}
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.value)}
              optionLabel='title'
              optionValue='id'
              className='my-3 w-25rem'
            />
            <span className='block m-2 text-sm font-italic text-left px-3'>
                  Оценки представлены по критериям в виде таблицы с результатами парных сравнений с другими решениями.
                  2 - Ваше решение лучше соответствующего; 1 - решения равны; 0 - Ваше решение хуже соответствующего;
                  -1 - оценка еще не произведена. В итоговом столбце считается сумма только по произведенным оценкам
            </span>
            <Accordion multiple>
              {criterias.map((criteria) => {
                return <AccordionTab header={criteria.name} key={criteria.criteria_id}>
                  <PairTable
                    marks={solutions.reduce((acc, el) => {
                      return [
                        ...acc,
                        ...el.pairing_marks.filter(
                          (elem) => elem.staff_id === selectedStaff && elem.criteria_id === criteria.criteria_id
                        )
                      ]
                    }, [])}
                    solutions={solutions.map((el) => el.solution_id)}
                  />
                </AccordionTab>
              })}
            </Accordion>
          </>
        )
      case 'simple':
        return <CriteriaTable
          criterias={criterias}
          marks={solutions.reduce((acc, el) => {
            return [...acc, ...el.marks.filter((elem) => elem.staff_id === user.id)]
          }, [])}
        />
      case 'pair':
        return (
          <>
            <span className='block mb-2 text-sm font-italic text-left px-3'>
                  Оценки представлены по критериям в виде таблицы с результатами парных сравнений с другими решениями.
                  2 - Ваше решение лучше соответствующего; 1 - решения равны; 0 - Ваше решение хуже соответствующего;
                  -1 - оценка еще не произведена. В итоговом столбце считается сумма только по произведенным оценкам
                </span>
            <Accordion multiple>
              {criterias.map((criteria) => {
                return <AccordionTab header={criteria.name} key={criteria.criteria_id}>
                  <PairTable
                    marks={solutions.reduce((acc, el) => {
                      return [
                        ...acc,
                        ...el.pairing_marks.filter(
                          (elem) => elem.staff_id === user.id && elem.criteria_id === criteria.criteria_id
                        )
                      ]
                    }, [])}
                    solutions={solutions.map((el) => el.solution_id)}
                  />
                </AccordionTab>
              })}
            </Accordion>
          </>
        )
    }
  }

  return (
    <>
      {renderMarking()}
    </>
  )
}

export default ResultsTab;