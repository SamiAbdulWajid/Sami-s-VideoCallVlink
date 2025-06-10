import { useNavigate } from 'react-router-dom';
import React from 'react';
import "../App.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>

                </div>
                <div className='navlist'>
                    <p role='button'onClick={() => navigate('/guest')}>Join as Guest</p>
                    <p role='button' onClick={() => navigate('/auth')}>Register</p>
                    <div role='button' className='button' onClick={() => navigate('/auth')}>
                        <p className='login'>Login</p>
                    </div>
                </div>
            </nav>

            <div className='landingPageMainContainer'>
                <div className='MainPageTxtArea'>
                    <p className='txt'>Connect with your <br /> Loved Ones </p>

                    <Link to="/auth"><button className='button1'>Get Started</button> </Link>


                </div>
                <img src="phoneimage.png" className="img" alt="" />
            </div>
        </div>
    );
}
