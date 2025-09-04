import { useState, useEffect } from "react";
import "./App.scss";
import { createItem, listAllItems } from "./utils/dynamo";

function App() {
  // id: String,  name: string, age: number, isAdopted: boolean
  const [pets, setPets] = useState([]);

  useEffect(() => {
    (async () => {
      const items = await listAllItems("Pet");
      console.log(items);
      setPets(items);
    })();
  }, []);

  const handleAddPet = async (event) => {
    event.preventDefault();

    const newPet = {};

    newPet.id = Date.now().toString();
    newPet.name = event.target.petName.value;
    newPet.age = parseInt(event.target.age.value);
    newPet.isAdopted = event.target.isAdopted.checked;

    console.log(newPet);

    await createItem("Pet", newPet);

    setPets((oldPets) => {
      return [...oldPets, newPet];
    });
  };

  return (
    <>
      <header>
        <h1>March Cohort's Pet Adoptions</h1>
      </header>
      <main>
        <form onSubmit={(event) => handleAddPet(event)}>
          <h2>Pet Intake Form</h2>
          <label htmlFor="">Name</label>
          <input type="text" name="petName" id="petName" />
          <br />
          <label htmlFor="">Age</label>
          <input type="number" name="age" id="age" />
          <br />
          <label htmlFor="">Adopted</label>
          <input type="checkbox" name="isAdopted" id="isAdopted" />
          <br />
          <button type="submit">Add Pet</button>
        </form>

        <section>
          <h2>Pet inventory</h2>
          {pets.length == 0 ? (
            <p>No pets available :(</p>
          ) : (
            <div>
              {pets &&
                pets.map((petObject, index) => {
                  return (
                    <div key={index}>
                      <p>{petObject.name}</p>
                      <p>{petObject.age}</p>
                      <p>{petObject.isAdopted ? "Adopted" : "Needs a Home"}</p>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
