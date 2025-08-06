import React from "react";
import Header from "../components/Header";
import Footer from "../components/footer";
import { GiWrappedHeart } from "react-icons/gi";

const About = () => {
  return (
    <div className="pt-5">
      <Header />
      <div
        className="about-container"
        style={{
          padding: "2rem",
          maxWidth: "900px",
          margin: "auto",
          lineHeight: "1.8",
        }}
      >
        <h1
          style={{ fontSize: "2rem", marginBottom: "1rem", color: "#b8860b" }}
        >
          Gold-Ora – Yes, Your Gold Destination!
        </h1>

        <h2 style={{ fontSize: "1.5rem", marginTop: "1.5rem", color: "#444" }}>
          Turning a Concept into a Reality
        </h2>
        <p>
          Since its inception in 2005, Gold-Ora has come a long way and achieved
          many milestones to become one of the leading powerhouse retailers in
          the region. UAE’s first-ever Big-Box concept started its journey as a
          15,000 sq ft gold store in Dubai. The brand’s perseverance and hard
          work have paid off with 33 stores in the United Arab Emirates,
          Bahrain, Egypt, and Oman today—and more in the offing.
        </p>

        <h2 style={{ fontSize: "1.5rem", marginTop: "1.5rem", color: "#444" }}>
          Widest Choice, Best Value, Trusted Service
        </h2>
        <p>
          With over 25,000 electronic products and accessories to choose from
          reputed international brands, Gold-Ora’s distinctive style of
          enhancing customer lifestyle has left an indelible mark on consumers’
          minds, making us a household name to be reckoned with. We pride
          ourselves on our exemplary service and product knowledge at the store
          level, coupled with the widest range of gold available at the best
          value on display at one location.
        </p>

        <h2 style={{ fontSize: "1.5rem", marginTop: "1.5rem", color: "#444" }}>
          Key Differentiators
        </h2>
        <p>
          Our 24-hour ‘Product not available, claim free’ brand promise is a
          Gold-Ora assurance to customers that all product availability concerns
          are satisfactorily met. Gold-Ora ensures that the products are
          authorized to avoid any post-purchase difficulty faced by customers.
        </p>
        <p>
          The Gold-Ora ‘best price guarantee’ is another highlight that ensures
          customers get the best value for any product across all Gold-Ora
          stores. If a customer finds a product cheaper elsewhere, Gold-Ora
          ensures the price is matched. This strengthens customers’ trust in
          Gold-Ora in delivering the best price in the market.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
