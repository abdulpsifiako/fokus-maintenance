 ;
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import HeaderSoalLatihanTO from '@/components/user/headerSoalLatihanTO';
import ContentQuizTO from '@/components/user/contentQuizTO';

export default function LatihanSoalTO() {
  const router = useRouter()
  const dataSoal = useSelector(state => state.tryout.dataLatihan); 
  const [isTimeout, setIsTimeout] = useState(false);


  const [currentIndex, setCurrentIndex] = useState(0);

  const [showEndModal, setShowEndModal] = useState(false);
 
  useEffect(()=>{
    if(!dataSoal){
      router.push('/tryout');
    }
  },[dataSoal, router])

  if(!dataSoal){
    return null
  }

  return (
    <div className='p-7 font-poppins my-7'>
       <HeaderSoalLatihanTO setShowEndModal={setShowEndModal} dataSoal={dataSoal} setIsTimeOut={setIsTimeout} currentIndex={currentIndex}/>
       <ContentQuizTO dataSoal={dataSoal} setShowEndModal={setShowEndModal} showEndModal={showEndModal} isTimeOut={isTimeout} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
    </div>
  );
}
