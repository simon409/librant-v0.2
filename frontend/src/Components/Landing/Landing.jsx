import React, {useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import Hero from "./Hero/Hero";
import Recommendations from "./Recommendations/Recommendations";

function Landing() {
    document.title = "Welcome to Librant";
    return(
        <>
            <NavBar />
            <Hero />
            <hr className="block mx-10 lg:hidden"/>
            <Recommendations />
        </>
    )
}

export default Landing;