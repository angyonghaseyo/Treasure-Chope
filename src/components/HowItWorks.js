// HowItWorks.js
import React, { useRef, useEffect } from 'react';

function HowItWorks() {
  const refOne = useRef(null);
  const refTwo = useRef(null);
  const refThree = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('expand-animate');
          } else {
            entry.target.classList.remove('expand-animate');
          }
        });
      },
      { threshold: 0.5 }
    );

    [refOne, refTwo, refThree].forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-fluid text-center py-4">
      <div className="py-4">
        <h2 className="h2 text-uppercase">How It Works</h2>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 px-5" ref={refOne}>
            {/* Order on website */}
            <span className="round-border my-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="none"
                    viewBox="0 0 80 80"
                  >
                    <path
                      fill="#FF6A90"
                      fillRule="evenodd"
                      d="M26.667 73.333h26.666A6.673 6.673 0 0060 66.667V13.333a6.673 6.673 0 00-6.667-6.666H26.667A6.673 6.673 0 0020 13.333v53.334a6.673 6.673 0 006.667 6.666zm0-16.666V13.333h26.666l.007 53.334H26.667v-3.334h26.666v-6.666H26.667zM33.333 20h13.334v6.667H33.333V20z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
            <h3 className="h3 mb-4">Order on website</h3>
            <p className="mb-4">Log in to Treasure Chope...</p>
          </div>
          <div className="col-12 col-md-4 px-5" ref={refTwo}>
            {/* Choose your food */}
            <span className="round-border my-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="none"
                    viewBox="0 0 80 80"
                  >
                    <path
                      fill="#FF6A90"
                      fillRule="evenodd"
                      d="M53.333 43.088c-10-1.597-10-10.668-10-18.088 0-10.28 5.857-18.333 13.334-18.333C64.143 6.667 70 14.72 70 25c0 7.42 0 16.49-10 18.088V70h-6.667V43.088zm3.334-6.421c6.093 0 6.666-2.06 6.666-11.667 0-6.873-3.513-11.667-6.666-11.667C53.513 13.333 50 18.127 50 25c0 9.607.573 11.667 6.667 11.667zM30 40h-3.333v30H20V40h-3.333A6.673 6.673 0 0110 33.333V10h6.667v23.333H20V10h6.667v23.333H30V10h6.667v23.333A6.673 6.673 0 0130 40z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
            <h3 className="h3 mb-4">Choose your food</h3>
            <p className="mb-4">Dive into a mouthwatering world...</p>
          </div>
          <div className="col-12 col-md-4 px-5" ref={refThree}>
            {/* Pick Up & Enjoy */}
            <span className="round-border my-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="none"
                    viewBox="0 0 80 80"
                  >
                    <path
                      fill="#FF6A90"
                      fillRule="evenodd"
                      d="M58.333 6.667a5.002 5.002 0 014.72 3.343c.342-.029.69-.005 1.03.074a5 5 0 11-.948 9.557l-2.005 3.007c3.464 4.212 1.156 10.636-.193 14.389l-.031.086a47.812 47.812 0 00-.72 2.115c2.402 3.359 4.23 4.717 5.598 5.734l.006.005c2.42 1.793 4.133 3.42 4.203 8.04.067 4.466-2.153 9.766-5.523 13.186C62.023 68.687 59.197 70 56.297 70h-36.56c-3.117 0-6.11-1.493-8.004-3.997C9.843 63.5 6.667 58.09 6.667 50c0-11.517 8.146-22.907 18.95-26.497 5.286-1.756 14.053-1.22 19.14 1.177l-.061.129c2.659-2.846 6.071-6.111 10.586-5.408l1.91-2.865a5.002 5.002 0 011.141-9.87zm-8.33 50L50 50h.007c1.073 0 2.486-.153 3.126-.88 1.09-1.236.677-4.536.43-6.506-.13-1.034-.23-1.94-.23-2.614 0-1.517.587-3.15 1.33-5.217 2.014-5.596 2.137-7.653.51-8.466-1.593-.79-2.636-.164-6.243 3.73-2.053 2.223-4.38 4.74-7.44 6.27-6.25 3.123-8.157 5.543-8.157 10.35 0 1.493 1.837 3.333 3.334 3.333v6.667c-5.14 0-10-4.86-10-10 0-8.627 4.733-12.76 11.843-16.317.292-.146.58-.313.865-.498-3.71-.906-8.751-.987-11.655-.019C19.653 32.51 13.333 41.37 13.333 50c0 6.373 2.6 10.5 3.72 11.98a3.344 3.344 0 002.684 1.353h36.556c1.434 0 2.76-1.133 3.427-1.81 2.133-2.16 3.65-5.7 3.607-8.41-.024-1.683-.024-1.683-1.507-2.786l-.005-.004a39.84 39.84 0 01-1.564-1.204c-.318 1.568-.953 3.095-2.114 4.411-1.837 2.083-4.577 3.137-8.134 3.137z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
            <h3 className="h3 mb-4">Pick Up & Enjoy!</h3>
            <p className="mb-4">Flash your confirmation code...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
