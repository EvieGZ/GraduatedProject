import React, { useState, useEffect } from 'react';
import './componentcss/BackToTop.css'
import { BiArrowToTop } from 'react-icons/Bi';

function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Set the top coordinate to 0
    // Make the scroll more smooth with 'smooth' behavior
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            //console.log("Should show the button now!");
            setIsVisible(true);
        } else {
            //console.log("Should hide the button now!");
            setIsVisible(false);
        }
    };
    
    return (
        <div>
            {isVisible && (
                <div onClick={scrollToTop} className="scroll-to-top">
                    <BiArrowToTop size={30} color='white'/>
                </div>
            )}
        </div>
    );
}

export default BackToTopButton;
