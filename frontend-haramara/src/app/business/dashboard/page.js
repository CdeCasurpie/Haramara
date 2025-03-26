"use client";
import { Activity, Calendar, ShoppingBag } from "lucide-react";
import StatisticsCard from "../business-components/StatisticsCard";
import CustomSlider from "../business-components/CustomSlider";
import styles from "./dashboard.module.css";
import BusinessActivity from "../business-components/BusinessActivity";

function generateTitleRandom() {
  let pronombres = ["El", "Un", "Algun", "Nuestro", "Su"];
  let adjetivos = ["grande", "bueno", "rojo", "especial", "importante"];
  let sustantivos_acuaticos_actividades = [
    "buceo",
    "snorkel",
    "surf",
    "kayak",
    "paddleboard",
  ];
  let sustantivos_acuaticos_cursos = [
    "buceo",
    "snorkel",
    "surf",
    "kayak",
    "paddleboard",
  ];
  let sustantivos_terrestres_actividades = [
    "senderismo",
    "escalada",
    "ciclismo",
    "campamento",
    "espeleología",
  ];

  let pronombre = pronombres[Math.floor(Math.random() * pronombres.length)];
  let adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];

  let sustantivo_actividad =
    sustantivos_acuaticos_actividades[
      Math.floor(Math.random() * sustantivos_acuaticos_actividades.length)
    ];

  let sustantivo_curso =
    sustantivos_acuaticos_cursos[
      Math.floor(Math.random() * sustantivos_acuaticos_cursos.length)
    ];

  let sustantivo_terrestre =
    sustantivos_terrestres_actividades[
      Math.floor(Math.random() * sustantivos_terrestres_actividades.length)
    ];

  let title = `${pronombre} ${adjetivo} ${sustantivo_actividad}`;

  return title;
}

export default function BusinessDashboard() {
  return (
    <div style={{ width: "100%", height: "100%", paddingLeft: "40px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          marginBottom: "20px",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <StatisticsCard
          icon={<Activity size={22} color="var(--primary-color)" />}
          title="Actividades"
          value="45"
          percentage={15.2}
          iconBgColor="rgba(0, 92, 173, 0.1)"
        />
        <StatisticsCard
          icon={<Calendar size={22} color="#D86100" />}
          title="Inscripciones de Hoy"
          value="12"
          percentage={-5.2}
          iconBgColor="#D8610015"
        />
        <StatisticsCard
          icon={<ShoppingBag size={22} color="#00C277" />}
          title="Ventas Hoy"
          value="25"
          percentage={5.2}
          iconBgColor="#00C27720"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "40px",
        }}
        className={styles.wrapMobile}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minWidth: "300px",
          }}
        >
          <CustomSlider title="Actividades Próximas">
            {Array.from({ length: 10 }, (_, i) => i).map((index) => {
                let title = generateTitleRandom();
                return (
                    <div key={index} style={{ height: "100%", width: "100%" }}>
                        <BusinessActivity
                        onEdit={() => {}}
                        activity={
                          {
                            title: title,
                            rating: 3,
                            images: [
                              {
                                url: "https://picsum.photos/seed/" + title + "/200/300",
                              }
                            ],
                          }
                        }
                        />
                    </div>
                    );
            })}
          </CustomSlider>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minWidth: "300px",
          }}
        >
          <CustomSlider title="Cursos Próximos">
            {/* generar array de n */}
            {Array.from({ length: 10 }, (_, i) => i).map((index) => {
                let title = generateTitleRandom();
                return (
                    <div key={index} style={{ height: "100%", width: "100%" }}>
                        <BusinessActivity
                        onEdit={() => {}}
                        activity={
                          {
                            title: title,
                            rating: 3,
                            images: [
                              {
                                url: "https://picsum.photos/seed/" + title + "/200/300",
                              }
                            ],
                          }
                        }
                        />
                    </div>
                    );
            })}
          </CustomSlider>
        </div>
      </div>
    </div>
  );
}
