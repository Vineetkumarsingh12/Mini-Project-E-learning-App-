import React, { useEffect, useState } from 'react'
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import { Link } from 'react-router-dom';
import { companylink } from '../../data/companyLink';
// import { useState } from 'react';
import { NavbarLinks } from '../../data/navbar-links';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import {FaChevronDown} from "react-icons/fa"
import {ImCross} from "react-icons/im"
import {HiMenu} from "react-icons/hi"

import {categories} from "../../services/apis";
import { gameLink } from '../../data/game';
import { ACCOUNT_TYPE } from "../../utils/constants";
import "./Navbar.css";
// 


const Navbar = () => {

  const token=useSelector((state)=>(state.auth.token));
  const totalItems=useSelector((state)=>(state.cart.totalItems));
  const userType=useSelector((state)=>(state.profile.user));
  const loaction=useLocation();
  // fectching category
  const [apiLinks,setLinks]=useState('');
  const [loading, setLoading] = useState(false);
  const [hide,sethide]=useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API);

  //      console.log("category");
  //       setLinks(res.data.data);

  //     } catch (err) {
  //       console.log("Error while fetching category list");
  //     }
  //   };
  
  //   fetchData(); // Call the async function here
  // }, []);


  
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        if (isMounted) {
          setLinks(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className=' max-w-maxContent flex flex-row items-center mx-auto justify-between w-11/12 text-richblack-25  '>
       <div>
<Link to="/">
  <img src={Logo} alt="logo" width={160} height={42} loading='lazy'/>
</Link>
       </div>
       <nav className={`md:flex justify-center ${hide?"hidden":"flex"}`}>
      <ul className=' text-richblack-25 flex  gap-x-6 '>
        {
      NavbarLinks.map((element,index)=>(
        <li key={index} className={`${element.path===loaction.pathname?"text-yellow-25":""} options`}>
         { element.title==="Catalog" || element.title==="Game" ||element.title==="Interenship"?(
         
         <div>
          {
         apiLinks?.length ? (<div className='flex flex-row   gap-1 group   relative '>
         <p className='
        '> {element.title}</p>
         <FaChevronDown/>
         {/*  */}
         <div className={`absolute invisible  flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200  group-hover:visible group-hover:opacity-100 top-10 z-20 w-[14rem] ${hide?"":"right-4"}`}>
          {
            element.title==="Catalog" && apiLinks.map((element,index)=>(
              <Link to={`/catalog/${element.name
                .split(" ")
                .join("-")
                .toLowerCase()}`} key={index}>
                <p className=' hover:bg-caribbeangreen-50 rounded p-1'>{element.name}</p>
              </Link>
            ))
}
            
         {  element.title==="Game" && gameLink.map((element,index)=>(
              <a href={element.link} target="_blank" rel="noopener noreferrer" key={index}>
                <p className=' hover:bg-caribbeangreen-50 rounded p-1'>{element.name}</p>
              </a>
            ))
          }
           
            {  element.title==="Interenship" && companylink.map((element,index)=>(
              <a href={element.link} target="_blank" rel="noopener noreferrer" key={index}>
                <p className=' hover:bg-caribbeangreen-50 rounded p-1'>{element.name}</p>
              </a>
            ))
          }
{/*  */}
         <div className='absolute h-6 w-6 rotate-45  bg-richblue-5 right-[30%] top-[-3%] opacity-0  transition-all duration-200  group-hover:opacity-100 z-10 invisible group-hover:visible '>

</div>
         </div>
    
         </div>):""
}
         </div>)   :(
   <Link to={element?.path}>
    {element.title}
   </Link>)
        }
        </li>
      ))
}
<li>
  {/* cross */}
  <ImCross className='cross  md:hidden' onClick={()=>sethide(true)}/>
</li>
      </ul>
      {/* hamebarger */}
     

       </nav>
      
       {/* signup,cart,userType */}
<div className='flex flex-row gap-3 items-center'>
  {
token && userType!==ACCOUNT_TYPE.INSTRUCTOR &&(
  <Link to="/dashboard/cart" className='relative'>
    <FaShoppingCart/>
    {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
  </Link>
)
  }

  {
    !token  &&
   <div className='flex flex-row gap-4'>
    <Link to="/login">
     <button className=' text-center p-1  border rounded-lg bg-richblack-700'>Login</button>
    </Link> 
    <Link to="/signup"><button className=' text-center p-[0.20rem]  border rounded-lg bg-richblack-700'>Signup</button></Link>
    </div>
  }


  {


token ? <ProfileDropdown/>:""  }
 <HiMenu className='menu   md:hidden ' onClick={()=>sethide(false)} />
</div>

       </div>
    </div>
  )
}

export default Navbar
