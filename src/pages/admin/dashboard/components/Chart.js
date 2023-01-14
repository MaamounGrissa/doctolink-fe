import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import styles from "../../../../styles/admin/Home.module.css";

function Chart(props) {
  var todayAppointments = [];
  props.appointments.map((appointment) => {
    todayAppointments.find((x) => x.name === appointment.reservation.type.name)
      ? (todayAppointments.find(
          (x) => x.name === appointment.reservation.type.name
        ).y += 1)
      : todayAppointments.push({
          name: appointment.reservation.type.name,
          color: appointment.reservation.type.color,
          y: 1,
          dataLabels: {
            enabled: true,
          },
        });
  });

  const options = {
    //  Styles
    chart: {
      width: "320",
      height: "320",
      spacing: [0, 0, 0, 10],
      backgroundColor: "transparent",
      type: "pie",
      options3d: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: props.appointments?.length + "<br /> RDV",
      align: "center",
      verticalAlign: "middle",
      style: {
        fontWeight: "bold",
        color: "#AAA",
        fontSize: "15px",
      },
    },
    plotOptions: {
      pie: {
        center: ["50%", "50%"],
        innerSize: 100,
        depth: 0,
        opacity: 0.9,
        borderWidth: 0,
        dataLabels: {
          distance: 10,
          color: "#666",
          style: { "font-size": "10px" },
          crookDistance: "100%",
        },
      },
    },
    // Data
    series: [
      {
        type: "pie",
        name: "RDV",
        data: todayAppointments,
      },
    ],
  };

  return (
    <div className={styles.chart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default Chart;
