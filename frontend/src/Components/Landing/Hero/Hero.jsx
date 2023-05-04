import BOY from "../../../assets/img/boy.jpg";
import logo from "../../../assets/img/logo.png";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

export default function Hero(){
    
    return(
        <div className="flex h-screen">
            <div className="lg:w-1/2 flex flex-col z-10 text-center lg:text-left">
                <div className="my-auto px-12 flex flex-col">
                    <div className="flex w-fit lg:w-full h-fit mx-auto">
                        <img src={logo} className="lg:w-24 lg:h-24 w-16 h-16 my-auto"/>
                        <p></p>
                        <h1 className="text-5xl lg:text-7xl font-bold my-auto">LIBRANT</h1>
                    </div>
                    <h1 className="lg:text-3xl text-xl font-bold">The new modern Library for <p className="lg:text-3xl inline text-xl text-my">you</p></h1>
                    <p className="mt-5">Welcome to <p className="inline font-bold">LIBRANT</p>. An intelligent library management system designed for easy browsing, checking out, and managing of library resources from anywhere. With a user-friendly interface and advanced technology, you can search, request holds, and renew materials effortlessly. Whether you're a student, teacher, or avid reader, LIBRANT makes your library experience more efficient and enjoyable. Start exploring today!</p>
                    <div className="mt-5">
                        <Button className="bg-mypalette-2">
                            <Link to="#" style={{ textDecoration: 'none'}}>
                                <span className="font-bold text-gray-800">Learn More</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-1/2 max-h-screen lg:flex hidden ">
                <div className="my-auto">
                    <img src={BOY} alt="" />
                </div>
            </div>
        </div>
    )
}