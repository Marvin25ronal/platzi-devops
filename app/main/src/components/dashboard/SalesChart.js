import { Card, CardBody, CardSubtitle, CardTitle, Col, Row, Spinner } from "reactstrap";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import constants from "../../utils/constants";
import axios from "axios";

const SalesChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getInfo()
  }, [])
  const getInfo = () => {
    const url = `${constants.API_URL}/cluster/list`
    axios.get(url)
      .then(res => {
        setData(res.data.data)
        setLoading(true)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const series = [
    {
      name: "2020",
      data: [20, 40, 50, 30, 40, 50, 30, 30, 40],
    },
    {
      name: "2022",
      data: [10, 20, 40, 60, 20, 40, 60, 60, 20],
    },
  ];
  if (loading) {
    return (
      <Row lg="12">
        {

          data.map((item, index) => {
            debugger
            const options = {
              chart: {
                toolbar: {
                  show: true,
                },
                stacked: true,

              },
              theme: {
                palette: 'palette1' // upto palette10
              },
              dataLabels: {
                enabled: true,
              },
              stroke: {
                show: true,
                width: 4,
                colors: ["transparent"],
              },
              legend: {
                show: true,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "30%",
                  borderRadius: 2,
                },

              },

              xaxis: {
                categories: item.urls.map(url => url.domain),
              },
              responsive: [
                {
                  breakpoint: 1024,
                  options: {
                    plotOptions: {
                      bar: {
                        columnWidth: "60%",
                        borderRadius: 7,
                      },
                    },
                  },
                },
              ],
            };
            const series = [{
              name: 'días restantes',
              data: item.urls.filter(url => url.ssl != null).map(url => url.ssl.daysRemaining)
            }]

            console.log(series)
            return (
              <Col lg="12">
                <Card key={index} >
                  <CardBody>
                    <CardTitle tag="h5">{item.name}</CardTitle>
                    {/* <CardSubtitle className="text-muted" tag="h6">
                    Yearly Sales Report
                  </CardSubtitle> */}
                    <Chart options={options} series={series} type="bar" height="379" />
                  </CardBody>
                </Card>
              </Col>
            )
          })
        }
      </Row>
    );
  } else {
    return (
      <Col lg="12" >
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Cargando.....
          </CardTitle>
          <CardBody className='text-center'>
            <Spinner />
          </CardBody>
        </Card>
      </Col>


    )
  }

};

export default SalesChart;
