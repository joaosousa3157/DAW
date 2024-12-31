import React, { useEffect, useState } from "react";
import "../css/miscPage.css";
import WineCard from "../components/WineCard";
import axios from "axios";

const MiscPage: React.FC = () => {

    const [accessories, setAccessories] = useState<any[]>([]);

    useEffect(() => {
      const fetchDeals = async () => {
        try {
          const response = await axios.get("/api/products?category=acessory");
          setAccessories(response.data);
        } catch (error) {
          console.error("Erro ao buscar os acessorios:", error);
        }
      };
  
      fetchDeals();
    }, []);

//   return (
//     <div className="accessories-page">
//       <header className="accessories-header">
//         <h1>Acessórios para Vinhos</h1>
//         <p>
//           Explore nossa seleção de acessórios que tornam sua experiência com
//           vinho ainda melhor.
//         </p>
//       </header>

//       <section className="accessories-list">
//         <div className="accessories-grid">
//           {accessories.map((accessory, index) => (
//             <WineCard
//               key={index}
//               id={accessory.id}
//               image={accessory.image}
//               name={accessory.name}
//               price={accessory.price}
//               rating={accessory.rating}
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
return (
    <div className="accesories-page">
      <header className="accesories-header">
        <h1>Acessórios para Vinhos</h1>
        <p>Explore nossa seleção de acessórios que tornam sua experiência com vinho ainda melhor.</p>
      </header>
      <section className="accesories-list">
        <div className="accesories-grid">
          {accessories.map((deal) => (
            <WineCard
              key={deal._id}
              id={deal._id}
              image={deal.image}
              name={deal.name}
              price={deal.price}
              rating={deal.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );

};


export default MiscPage;
