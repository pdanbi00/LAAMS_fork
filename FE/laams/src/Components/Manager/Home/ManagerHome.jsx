import React, { useCallback, useEffect, useState } from 'react'
import Calendar from './Calendar'
import useApi from '../../../Hook/useApi';
import useCreateRoom from '../../../Hook/useCreateRoom';
import { useSelector } from 'react-redux';

const ManagerHome = () => {
  const [examList,setExamList] = useState();
  const api = useApi();
  const [curDate,setCurDate] = useState(new Date());
  const createRoom = useCreateRoom();
  const accessToken = useSelector(state=>state.User.accessToken);
  useEffect(()=>{
    if(!accessToken) return;
    createRoom();
  },[createRoom,accessToken])
  const getExamList = useCallback(async(date)=>{
    await api.get(`manager/exam/monthly?year=${date.getFullYear()}&month=${date.getMonth()+1}`)
    .then(({data})=>{
      const res = {};
      data.forEach(e=>{
        const date = new Date(e.examDate);
        if(res[date.getDate()]){
          res[date.getDate()].push({
            centerName : e.centerName,
            examDate : new Date(e.examDate),
            managerName: e.managerName,
            examType : e.examType,
            examLanguage : e.examLanguage
          });
        }else{
          res[date.getDate()]=[{
            centerName : e.centerName,
            examDate : new Date(e.examDate),
            managerName: e.managerName,
            examType : e.examType,
            examLanguage : e.examLanguage
          }];
        }
      });

      setExamList(res);
    }).catch(err=>console.log(err.response));
  },[api]);

  useEffect(()=>{
    if(!curDate) return;
    getExamList(curDate);
  },[getExamList,curDate]);

  //TODO : 이전 달 호출
  //FIXME : 데이터 갱신
  const handlePrev = useCallback(()=>{
    let year = curDate.getFullYear();
    let month = curDate.getMonth();
    if(month === 0){
      month = 11;
      year--;
    }else{
      month--;
    }
    setCurDate(new Date(year,month,1));
  },[curDate]);

  //TODO : 다음달 호출
  //FIXME : 데이터 갱신
  const handleNext = useCallback(()=>{
    let year = curDate.getFullYear();
    let month = curDate.getMonth();
    if(month === 11){
      month = 0;
      year++;
    }else{
      month++;
    }
    setCurDate(new Date(year,month,1));
  },[curDate])

  return (
    <section className='manager-home'>
      <Calendar handleNext={handleNext} handlePrev={handlePrev} curDate={curDate} examList={examList}></Calendar>
    </section>
  )
}

export default ManagerHome