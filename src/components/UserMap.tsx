// ** styles
import styles from "../styles/Components/UserMap.module.css";
// ** Hooks
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

interface CityPoint {
  city: string;
  lat: number;
  long: number;
  users: number;
}

interface UserMapProps {
  data: CityPoint[];
  title: string;
}

const UserMap: React.FC<UserMapProps> = ({ data, title }) => {
  const mapRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 1000;
    const height = 600;
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-group");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 40])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("end", (event) => {
        const extent = event.selection;
        if (extent) {
          svg.select<SVGGElement>(".brush").call(brush.move, null);
          svg
            .transition()
            .duration(1500)
            .call(
              zoom.transform as any,
              d3.zoomIdentity
                .scale(width / (extent[1][0] - extent[0][0]))
                .translate(-extent[0][0], -extent[0][1])
            );
        } else {
          svg
            .transition()
            .duration(1500)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.scale(1).translate(0, 0)
            );
        }
      });

    svg
      .append("g")
      .attr("class", "brush")
      .call(brush as any);

    d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(
      (worldData: any) => {
        const countries = (
          topojson.feature(
            worldData,
            worldData.objects.countries
          ) as unknown as GeoJSON.FeatureCollection
        ).features;
        const projection = d3
          .geoMercator()
          .translate([width / 2, height / 1.5])
          .scale(150);
        const path = d3.geoPath().projection(projection);

        g.selectAll("path")
          .data(countries)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#2f434a")
          .attr("stroke", "#4e5f66");

        const continents = [
          { name: "أفريقيا", coords: [20, 5] },
          { name: "آسيا", coords: [100, 40] },
          { name: "أوروبا", coords: [20, 55] },
          { name: "أمريكا الشمالية", coords: [-100, 45] },
          { name: "أمريكا الجنوبية", coords: [-60, -15] },
          { name: "أستراليا", coords: [135, -25] },
        ];

        g.selectAll("text.continent-label")
          .data(continents)
          .enter()
          .append("text")
          .attr("class", "continent-label")
          .attr("x", (d) => {
            const projected = projection(d.coords as [number, number]);
            return projected ? projected[0] : 0;
          })
          .attr("y", (d) => {
            const projected = projection(d.coords as [number, number]);
            return projected ? projected[1] : 0;
          })
          .text((d) => d.name)
          .style("fill", "#fff")
          .style("font-size", "14px")
          .style("font-weight", "bold")
          .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)");

        const tooltip = d3.select("#tooltip");

        const mouseover = (event: MouseEvent, d: CityPoint) => {
          tooltip
            .html(`<b>${d.city}</b><br/>عدد المستخدمين: ${d.users}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
            .style("opacity", "0.9");
        };

        const mouseout = () => {
          tooltip.style("opacity", "0");
        };

        g.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => {
            const coords = projection([d.long, d.lat]);
            return coords ? coords[0] : 0;
          })
          .attr("cy", (d) => {
            const coords = projection([d.long, d.lat]);
            return coords ? coords[1] : 0;
          })
          .attr("r", 0)
          .style("fill", "#b85a62")
          .style("opacity", 0.6)
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .transition()
          .duration(1000)
          .attr("r", (d) => Math.sqrt(d.users) * 0.3);
      }
    );
  }, [data]);

  return (
    <div className={styles.mapContainer}>
      <h1 className={styles.title}>{title}</h1>
      <svg ref={mapRef} className={styles.svgBackground} />
      <div id="tooltip" className={styles.tooltip}></div>
      <div className={styles.legend}>
        <p>
          <strong>مفتاح الخريطة:</strong>
        </p>
        <p>● حجم الدائرة يعكس عدد المستخدمين.</p>
        <p>● أسماء القارات معروضة لتوضيح التوزيع الجغرافي.</p>
        <p>
          ● الدوائر تمثل المدن التي بها مستخدمين. حجم الدائرة يعكس عدد
          المستخدمين.
        </p>
        <p>
          ● يمكنك السحب للتكبير والتصغير، أو تحديد منطقة للتكبير باستخدام السحب
          بالماوس.
        </p>
      </div>
    </div>
  );
};

export default UserMap;
