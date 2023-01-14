import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { WithContext as ReactTags } from "react-tag-input";
import { useSelector } from "react-redux";

function AddAgenda(props) {
  const [formData, setFormData] = useState({
    name: "",
    types: [],
    establishment: "",
  });

  const [types, setTypes] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);

  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  // REACT TAGS
  const [tags, setTags] = useState([]);
  const delimiters = [188, 13];

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const addAgenda = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/agenda/add", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      document.getElementById("form").reset();
      setTags([]);
      props.fetchAgendas();
      getTypes();
      toggleModal();
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const getTypes = async () => {
    const { data } = await axios.post(
      `/type/getbyest/${userInfo.establishment}`
    );
    setTypes(data);
  };

  useEffect(() => {
    getTypes();
  }, []);

  return (
    <>
      <h1>ajout d’agenda</h1>
      <form id="form" onSubmit={addAgenda}>
        <div className="row">
          <input
            required
            style={{ width: "800px" }}
            className="defaultInput"
            type="text"
            placeholder="nom"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div className="row">
          <ReactTags
            tags={tags}
            suggestions={types}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            delimiters={delimiters}
            placeholder="type de consultation (insérez ',' après chaque type ou appuyez sur 'espace')"
          />
        </div>
        <div className="row">
          <button
            onClick={() => {
              setFormData({
                ...formData,
                types: tags,
                establishment: userInfo?.establishment,
              });
            }}
            type="submit"
            className="defaultBtn"
          >
            enregister
          </button>
          &nbsp;
          <button
            type="button"
            onClick={() => {
              toggleModal();
            }}
            className="cancelBtn"
          >
            annuler
          </button>
        </div>
      </form>
    </>
  );
}

export default AddAgenda;
