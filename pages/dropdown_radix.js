import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { stations } from "../components/Stations";
import styles from "../styles/Scroll.module.css";
import React, { useEffect, useState } from "react";

export const DropdownMenuDemo = () => {
  const [id, setID] = useState();
  const [station, setStation] = useState([]);
  const [meteo, setMeteo] = useState({});

  const URL = `https://api.openweathermap.org/data/2.5/onecall`;
  const API_KEY = `c44f77911579d2cbc82efc379374400c`;

  const getStation = async (id) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${id}&appid=${API_KEY}`
    );
    const data = await res.json();
    const latLon = data.coord;
    const res2 = await fetch(
      `${URL}?lat=${latLon.lat}&lon=${latLon.lon}&exclude=minutely&appid=${API_KEY}&units=metric`
    );
    const weatherRender = await res2.json();
    console.log(weatherRender);
    setMeteo(weatherRender);
    setStation(latLon);
    setID(id);
  };

  return (
    <>
      <div className={styles.main}>
        <div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>Trigger </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {stations.map((station) => (
                <DropdownMenu.Item
                  onSelect={(e) => getStation(e.target.innerText)}
                  value={station.name}
                >
                  {station.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <h4>Here is the weather for {id}</h4>
        </div>

        <div>
          <h2>Current weather</h2>
          <p>Temperature: {meteo.current?.temp} °C </p>
          <p>Feels like: {meteo.current?.feels_like} °C </p>
          {meteo.current.weather?.map((description) => (
            <p>{description.main}</p>
          ))}
          {meteo.weather?.map((description) => (
            <h3>{description.main}</h3>
          ))}
        </div>
        <div>
          <h2>Hourly weather</h2>
          <ScrollArea.Root className={styles.ScrollArea}>
            <ScrollArea.Viewport className={styles.Viewport}>
              <div className={styles.Box}>
                <div className={styles.tag}>
                  <div className={styles.Box}>
                    {meteo.hourly?.map((hours, index) => (
                      <div className={styles.tag} data-index={index}>
                        <tag>
                          {new Date(hours.dt * 1000).toLocaleString("en-GB", {
                            timeZone: "UTC",
                          })}
                          {/* {new Date(hours.dt * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} */}
                        </tag>
                        <tag>{Math.round(hours.temp)} °C</tag>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="horizontal"
              className={styles.Scrollbar}
            >
              <ScrollArea.Thumb className={styles.Thumb} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </div>
    </>
  );
};

export default DropdownMenuDemo;
