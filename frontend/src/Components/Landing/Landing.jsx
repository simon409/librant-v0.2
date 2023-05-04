import React, {useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import Hero from "./Hero/Hero";

function Landing() {
    document.title = "Welcome to Librant";
    return(
        <>
            <NavBar />
            <Hero />
        </>
    )
}

export default Landing;