import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";



const Starter = () => {
  return (
    <div>
      {/***Top Cards***/}

      {/***Sales & Feed***/}
      <Row>
        <Col lg="12" >
          <SalesChart />
        </Col>
        {/* <Col sm="6" lg="6" xl="5" xxl="4">
          <Feeds />
        </Col> */}
      </Row>
     
      {/* <Row>
        <Col lg="12">
          <ProjectTables />
        </Col>
      </Row> */}
      {/***Blog Cards***/}
      {/* <Row>
        {BlogData.map((blg, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.description}
              color={blg.btnbg}
            />
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default Starter;
