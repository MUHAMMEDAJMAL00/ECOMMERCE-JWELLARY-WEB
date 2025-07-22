import React from "react";
import "../styles/newstyles.scss";
import { FaCcPaypal } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";
import { FaCcApplePay } from "react-icons/fa";
import lucky from "../assets/images/lucky.png";
import { PiFacebookLogoBold } from "react-icons/pi";
import { IoLogoInstagram } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className=" row ">
        <div className="footer1   col-lg-6 col-xl-6">
          <div className="contentfooter g-20 row">
            <div className="textfooter  g-20 col-lg-4 col-xl-4">
              <ul className="unordered">
                <li className="footerheadtext">Company</li>
                <li className="footertext">About</li>
                <li className="footertext">Best Price</li>
                <li className="footertext">Careers</li>
                <li className="footertext">Solution Bar</li>
                <li className="footertext">Brand Promise</li>
                <li className="footertext">Terms and Conditions</li>
                <li className="footertext">Share</li>
                <li className="footertext">Contact Us</li>
              </ul>
            </div>
            <div className="textfooter col-lg-4 col-xl-4">
              <ul className="unordered">
                <li className="footerheadtext"> Assistance</li>

                <li className="footertext">Check Warranty Status</li>
                <li className="footertext">Store Locator </li>
                <li className="footertext">Easy Payment Plan</li>
                <li className="footertext">Return and Exchange Policy</li>
                <li className="footertext">Bulk Order Enquires</li>
                <li className="footertext">Newsletter</li>
                <li className="footertext">Whatsapp Us</li>
                <li className="footertext">+971 54 581 6161</li>
                <li className="footertext">Tell Us More</li>
              </ul>
            </div>
            <div className="textfooter   col-lg-4 col-xl-4">
              <ul className="unordered ">
                <li className="footerheadtext"> Policies</li>

                <li className="footertext">Refund Policy</li>
                <li className="footertext">Buyback Policy</li>
                <li className="footertext">Exchange Policy</li>
                <li className="footertext">Shipping Policy</li>
                <li className="footertext">Cancellation Policy</li>
                <li className="footertext">Privacy Policy</li>
                <li className="footertext">Terms of Service</li>
                <li className="footertext">Disclaimer Policy</li>
                <li className="footertext">Report Fraud</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer2  col-lg-6 col-xl-6">
          <div className="row footer5">
            <div className="footer6  col-lg-6 col-xl-6">
              <div className=" footerpay">
                <div className="footerheadtext">Payment Method</div>
                <div className="payicon">
                  <FaCcVisa size={40} />
                  <FaCcMastercard size={40} />
                  <FaCcPaypal size={40} />
                  <FaCcApplePay size={40} />
                </div>
              </div>
            </div>
            <div className="footer6  g-0 col-lg-6 col-xl-6">
              <div className="footer7">
                <img src={lucky} className="footerlucky" />
              </div>
              <div className="footersocialmedia">
                <PiFacebookLogoBold size={24} />
                <IoLogoInstagram size={24} />
                <FaXTwitter size={24} />
                <FaWhatsapp size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="line1">
          <hr className="line" />
        </div>
        <div className="row lastfooter">
          <div className=" lastfirst col-lg-6 col-xl-6">
            COPYRIGHT © 2023 Lucky Star Gold LLC. ALL RIGHTS RESERVED
          </div>

          <div className="lastsecond col-lg-6 col-xl-6">
            Terms and conditions Privacy policy & Cookies
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
