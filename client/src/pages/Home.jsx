import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { IoMicOutline } from "react-icons/io5";
import { MdBolt } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineTouchApp } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { MdOutlineGroupAdd } from "react-icons/md";
import { NavLink } from 'react-router';
const Home = () => {
  return (
    // color: #3525cD;
   <>
  <main className=' '>
     <section className=' bg-linear-to-tr from-blue-50 to-gray-100 lg:pb-40 pb-14 flex flex-col lg:flex-row gap-10 xl:px-32 pt-30 sm:pt-50 px-5   '>
    <section className=' xl:w-[50%]  bg-gray-50 lg:p-12 p-5 rounded-4xl flex flex-col gap-10'>
       <div> 
        <button className='rounded-2xl bg-gray-200 text-violet-700 px-5 font-medium'>Now with AI-Clarity</button></div>
     <div className=' xl:text-8xl md:text-7xl sm:text-5xl text-4xl font-extrabold text-gray-900'>
      <h1 className=''>Conversations</h1>
     <h1 className='text-violet-700 py-2'>Without Friction.</h1></div>
     <div className='text-xl font-semibold leading-8'>
      <p>Experience the next generation of real-time communication. Fluid Chat blends editorial elegance with high-performance networking for meaningful human connection.</p>
     </div>
     <article className=' flex flex-col sm:flex-row gap-5 font-bold'>
      <NavLink to="/login" className='rounded-xl  text-white bg-violet-700 text-xl p-5 px-8 flex items-center gap-3 justify-center shadow-md hover:shadow-xl cursor-pointer'>
          <span>Start Chatting Now</span>
           <FaArrowRightLong/>
      </NavLink>
      
        <button className='rounded-xl text-gray-800 text-xl bg-gray-300 px-5 py-3 cursor-pointer '>View Demo</button>
     </article>
    </section>

    <section className="h-150 md:h-150 lg:w-3xl relative xl:mt-44 mt-20 xl:ml-0 ml-10 ">

  {/* Top Left (BIG) */}
  <article className=" animate-float animate-[float_4s_ease-in-out_infinite] shadow-2xl  p-4 lg:left-24 left-9 absolute bg-white rounded-3xl ">
    <h3>SARAHM.</h3>
    <p>Did you see the latest update?</p>
    <p>The clarity is insane! 🚀</p>
  </article>

  {/* Top Right */}
  <article className="animate-floatt shadow-2xl  animate-[floatt_4s_ease-in-out_infinite] font-bold lg:right-5 right-8  top-40 bg-white absolute rounded-3xl p-4 flex gap-2 text-sm ">
   <img width="50px" height="50px" className='rounded-xl' src="https://tse1.mm.bing.net/th/id/OIP.pgD_a0qYj1Cg1OVKV4VlFQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
  <div>
     <h3>ALEX Rivera</h3>
   <p className='text-sm'>PRODUCT LEAD</p>
  </div>

  </article>

  <article className="animate-float  animate-[float_4s_ease-in-out_infinite] 
   lg:right-40
    top-20 text-violet-700 bg-gray-50 absolute rounded-3xl p-3 shadow-2xl
  "><IoMicOutline/></article>



  {/* Bottom Left (Purple) */}
  <article className="bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-4xl p-5 flex absolute top-64 xl:top-60 left-14  flex-col justify-center items-center animate-floatt shadow-2xl  animate-[floatt_4s_ease-in-out_infinite] ">
    <span className="text-6xl"><MdBolt /></span>
    <h3 className="text-lg  font-semibold mt-2">
    9ms
    </h3>
    <h6 className='font-semibold'>LATENCY</h6>
  </article>
  {/* heart */}
   <article className="animate-float  animate-[float_4s_ease-in-out_infinite]  md:left-80 lg:left-40 top-50 text-violet-700 bg-gray-50 absolute rounded-3xl p-3 shadow-2xl
  "><CiHeart/></article>

  {/* Bottom Right (Tall) */}
  <div className=" absolute lg:right-28 right-12 top-96 p-5 font-medium text-gray-500 bg-white rounded-4xl  flex-col items-center justify-center animate-float shadow-2xl  animate-[float_4s_ease-in-out_infinite] text-sm ">
    <h6>System: Connection</h6>
    <h6>encrypted with AES-256</h6>
    <h6>protocol.</h6>
  </div>

</section>
 
    </section>

    {/* how it works */}
    <section className=' flex flex-col gap-10 p-3 xl:px-32 py-20 px-6 md:px-10 md:gap-20 sm:px-5'>
     <div className='text-center'>
       <h1 className='text-3xl md:text-6xl italic font-bold mb-5'>How it Works</h1>
      <p className='font-medium text-md md:text-xl text-gray-900'>Get started in seconds with our zero-friction onboarding flow.</p>
     </div>
      <div className='flex flex-col md:flex-row gap-10 md:gap-5 '>
        <article className='group bg-zinc-50 p-10 rounded-4xl flex flex-col gap-5 hover:bg-white hover:border border-transparent hover:border-gray-300 hover:shadow transition-all duration-500 '>
          <MdOutlineTouchApp className='text-6xl text-violet-700 rounded-3xl bg-gray-100 p-3 group-hover:bg-violet-700 group-hover:text-white transition-all duration-500 group-hover:text-7xl ' />
          <h2 className='text-violet-700 font-bold'>STEP 01</h2>
          <h3 className='font-bold text-2xl'>Click Start</h3>
          <p className='font-medium text-lg'>Launch the interface instantly. No lengthy forms, no hidden hurdles. Just pure conversation.</p>
        </article>
        <article className='group bg-zinc-50 p-10 rounded-4xl flex flex-col gap-5 hover:bg-white hover:border border-transparent hover:border-gray-300 hover:shadow transition-all duration-500 '>
         <MdOutlineGroupAdd  className='text-6xl text-violet-700 rounded-3xl bg-gray-100 p-3 group-hover:bg-violet-700 group-hover:text-white transition-all duration-500 group-hover:text-7xl '/>
          <h2 className='text-violet-700 font-bold'>STEP 02</h2>
          <h3 className='font-bold text-2xl'>Invite Friends</h3>
          <p className='font-medium text-lg'>Share your unique magic link. Anyone can join with a single tap, right from their browser.</p>
        </article>
        <article className='group bg-zinc-50 p-10 rounded-4xl flex flex-col gap-5 hover:bg-white hover:border border-transparent hover:border-gray-300 hover:shadow transition-all duration-500 '>
         <LuMessageCircleMore  className='text-6xl text-violet-700 rounded-3xl bg-gray-100 p-3 group-hover:bg-violet-700 group-hover:text-white transition-all duration-500 group-hover:text-7xl ' />
          <h2 className='text-violet-700 font-bold'>STEP 03</h2>
           <h3 className='font-bold text-2xl'>Real Time Chat</h3>
          <p className='font-medium text-lg'>Experience zero-lag messaging with rich media support and atmospheric UI design.</p>
        </article>
        <article></article>
      </div>
    </section>
  </main>
    </>
  )
}

export default Home
