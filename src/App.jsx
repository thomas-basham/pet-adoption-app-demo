import { useState, useEffect } from "react";
import "./App.scss";
import {
  createItem,
  listAllItems,
  updateItem,
  deleteItem,
} from "./utils/dynamo";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function App() {
  // id: String,  name: string, age: number, isAdopted: boolean
  const [pets, setPets] = useState([]);
  const [open, setOpen] = useState(false);
  const [petToUpdate, setPetToUpdate] = useState({});

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    (async () => {
      const items = await listAllItems("Pet");
      console.log(items);
      setPets(items);
    })();
  }, []);

  const handleOpen = (petObject) => {
    setPetToUpdate(petObject);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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

  const handleUpdatePet = async (event) => {
    event.preventDefault();

    const { age, isAdopted } = petToUpdate;

    console.log(petToUpdate.id);
    await updateItem(
      "Pet",
      { id: petToUpdate.id, name: petToUpdate.name },
      { age, isAdopted }
    );

    setPets((oldPets) => {
      return oldPets.map((petObject) => {
        return petObject.id === petToUpdate.id ? petToUpdate : petObject;
      });
    });

    setOpen(false);
  };

  const handleDeletePet = async (id, name) => {
    await deleteItem("Pet", { id: id, name: name });
    console.log(id);
    setPets((oldPets) => {
      return oldPets.filter((petObject) => {
        return petObject.id == id;
      });
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
          <label htmlFor="petName">Name</label>
          <input type="text" name="petName" id="petName" />
          <br />
          <label htmlFor="age">Age</label>
          <input type="number" name="age" id="age" />
          <br />
          <label htmlFor="isAdopted">Adopted</label>
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
                      <Button onClick={() => handleOpen(petObject)}>
                        Update Pet Information
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeletePet(petObject.id, petObject.name)
                        }
                      >
                        Remove From Inventory
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <form onSubmit={(event) => handleUpdatePet(event)}>
                <h2>Pet Intake Form</h2>
                <label htmlFor="petName">Name</label>
                <input
                  value={petToUpdate.name}
                  type="text"
                  name="petName"
                  id="petName"
                  disabled
                  onChange={(event) =>
                    setPetToUpdate({
                      id: petToUpdate.id,
                      name: event.target.value,
                      age: petToUpdate.age,
                      isAdopted: petToUpdate.isAdopted,
                    })
                  }
                />
                <br />
                <label htmlFor="age">Age</label>
                <input
                  onChange={(event) =>
                    setPetToUpdate({
                      id: petToUpdate.id,
                      name: petToUpdate.name,
                      age: event.target.value,
                      isAdopted: petToUpdate.isAdopted,
                    })
                  }
                  value={petToUpdate.age}
                  type="number"
                  name="age"
                  id="age"
                />
                <br />
                <label htmlFor="isAdopted">Adopted</label>
                <input
                  onChange={(event) =>
                    setPetToUpdate({
                      id: petToUpdate.id,
                      name: petToUpdate.name,
                      age: petToUpdate.age,
                      isAdopted: event.target.checked,
                    })
                  }
                  checked={petToUpdate.isAdopted}
                  type="checkbox"
                  name="isAdopted"
                  id="isAdopted"
                />
                <br />
                <button type="submit">Add Pet</button>
              </form>
            </Box>
          </Modal>
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default App;
