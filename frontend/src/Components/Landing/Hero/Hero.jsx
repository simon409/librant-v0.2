import BOY from "../../../assets/img/boy.jpg";
import logo from "../../../assets/img/logo.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';

export default function Hero(){
    const [t] = useTranslation(); 
    return(
        <div className="flex h-screen">
            <div className="lg:w-1/2 flex flex-col z-10 text-center lg:text-left">
                <div className="my-auto px-12 flex flex-col">
                    <div className="flex w-fit lg:w-full h-fit mx-auto">
                        <img src={logo} className="lg:w-24 lg:h-24 w-16 h-16 my-auto"/>
                        <p></p>
                        <h1 className="text-5xl lg:text-7xl font-bold my-auto">LIBRANT</h1>
                    </div>
                    <h1 className="lg:text-3xl text-xl font-bold">{t("new_lib_title")}</h1>
                    <p className="mt-5 text-sm lg:text-lg">
                        {t('landing_presentation')}
                    </p>
                    <div className="mt-5">
                        <Button className="bg-mypalette-2">
                            <Link to="/books" style={{ textDecoration: 'none'}}>
                                <span className="font-bold text-gray-800">{t('learn_more')}</span>
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