import React, { useState, useEffect } from 'react';
import Loader from '../Loader';
import {SolutionsService} from "../../services/solutionsService";
import {EventsService} from "../../services/eventService";
import SolutionItem from "./SolutionItem";
import {Accordion, AccordionTab} from "primereact/accordion";

const CriteriaMarking = ({ eventId }) => {
  const [solutions, setSolutions] = useState([]);
  const [criterias, setCriterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    const solutionsRequest = SolutionsService.getSolutionsByEvent(eventId);
    const criteriasRequest = EventsService.getCriterias();
    Promise.all([solutionsRequest, criteriasRequest])
      .then(([solutionsResponse, criteriasResponse]) => {
        setCriterias(criteriasResponse.criterias);
        setSolutions(solutionsResponse.solutions);
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch();
  }, [])

  if (loading) {
    return <Loader />
  }

  return <div>
    <Accordion multiple>
      {solutions.map((el) => {
        return <AccordionTab header={`Решение №${el.solution_id}`} key={el.solution_id}>
          <SolutionItem solution={el} criterias={criterias} fetch={fetch} />
        </AccordionTab>
      })}
    </Accordion>
  </div>
}

export default CriteriaMarking;