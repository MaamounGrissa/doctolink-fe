import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../../utils/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";
import styles from "../../../../styles/admin/Config.module.css";
import AddIcon from "@mui/icons-material/Add";
import AddCell from "./AddCell";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveCell from "./RemoveCell";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

function ConfigAgenda(props) {
  const { toggleModal } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const [cellInfo, setCellInfo] = useState({
    row: {},
    type: "",
    color: "",
    start: "",
    end: "",
    cellIndex: 0,
    Qty: 1,
  });

  const [tableRows, setTableRows] = useState([
    {
      days: [
        {
          dayIndex: 0,
          cells: [],
        },
        {
          dayIndex: 1,
          cells: [],
        },
        {
          dayIndex: 2,
          cells: [],
        },
        {
          dayIndex: 3,
          cells: [],
        },
        {
          dayIndex: 4,
          cells: [],
        },
        {
          dayIndex: 5,
          cells: [],
        },
        {
          dayIndex: 6,
          cells: [],
        },
      ],
    },
  ]);
  const [copiedRowIndex, setCopiedRowIndex] = useState(null);
  const [copiedColIndex, setCopiedColIndex] = useState(null);
  const [duration, setDuration] = useState(30);
  const [tempId, setTempId] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [types, setTypes] = useState([]);

  const addRow = () => {
    setTableRows([
      ...tableRows,
      {
        days: [
          {
            dayIndex: 0,
            cells: [],
          },
          {
            dayIndex: 1,
            cells: [],
          },
          {
            dayIndex: 2,
            cells: [],
          },
          {
            dayIndex: 3,
            cells: [],
          },
          {
            dayIndex: 4,
            cells: [],
          },
          {
            dayIndex: 5,
            cells: [],
          },
          {
            dayIndex: 6,
            cells: [],
          },
        ],
      },
    ]);
  };

  const addCell = async (cell) => {
    var exists = false;
    const update = await cell.row.days.map((day) => {
      if (day.dayIndex === cell.cellIndex) {
        for (let i = 0; i < day.cells.length; i++) {
          if (day.cells[i]?.type === cell?.type) {
            exists = true;
            day.cells[i].Qty = Number(
              Number(day.cells[i].Qty) + Number(cell.Qty)
            );
          }
        }
        if (!exists) {
          day.cells = [
            ...day.cells,
            {
              type: cell.type,
              start: cell.start,
              end: cell.end,
              Qty: Number(cell.Qty),
            },
          ];
        }
      }
      return tableRows;
    });
    setTableRows(...update);
    setAction("");
  };

  const removeCell = async (row, type, cellIndex) => {
    const update = await row.days.map((day) => {
      if (day.dayIndex === cellIndex) {
        for (let i = 0; i < day.cells.length; i++) {
          if (day.cells[i].type === type) {
            if (day.cells[i].Qty - 1 <= 0) {
              day.cells[i] = {};
            } else {
              day.cells[i].Qty -= 1;
            }
          }
        }
      }
      return tableRows;
    });
    setTableRows(...update);
    setAction("");
  };

  const configCell = (row, index, cellIndex) => {
    setCellInfo({
      row: row,
      type: "",
      start: moment(`${props.agenda.establishment.startHour}:00`, [
        moment.ISO_8601,
        "HH:mm",
      ])
        .add(index !== 0 ? duration * index : 0, "minutes")
        .format("HH:mm"),
      end: moment(`${props.agenda.establishment.startHour}:00`, [
        moment.ISO_8601,
        "HH:mm",
      ])
        .add(duration * (index + 1), "minutes")
        .format("HH:mm"),
      cellIndex: cellIndex,
      Qty: 0,
    });
    setAction("ADD_CELL");
  };

  const pasteRow = async (index, start, end) => {
    let copiedRow = JSON.parse(JSON.stringify(tableRows[copiedRowIndex]));
    copiedRow.days.map((day) => {
      day.cells.map((cell) => {
        cell.start = start;
        cell.end = end;
      });
    });
    tableRows[index] = copiedRow;
    setCopiedRowIndex(null);
  };

  const pasteCol = async (index) => {
    var copiedCells = [];
    tableRows.map((row) => {
      row.days.map((day) => {
        if (day.dayIndex === copiedColIndex) {
          copiedCells.push([...copiedCells, ...day.cells]);
        }
      });
    });
    tableRows.map((row, rowIndex) => {
      row.days.map((day) => {
        if (day.dayIndex === index) {
          try {
            day.cells = JSON.parse(JSON.stringify(copiedCells[rowIndex]));
          } catch (error) {}
        }
      });
    });
    setCopiedColIndex(null);
  };

  const configAgenda = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/agenda/config/${props.agenda._id}`, {
        table: tableRows,
        duration: duration,
        tempId: tempId,
      });
      setTempId("");
      enqueueSnackbar(data.message, { variant: "success" });
      props.fetchAgendas();
      toggleModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchTypes = async () => {
    const { data } = await axios.post(`/type/getbyagenda/${props.agenda._id}`);
    setTypes(data);
  };

  useEffect(() => {
    if (props.agenda) {
      fetchTypes();
    }
    if (props.agenda.template) {
      setTableRows(props.agenda.template.table);
      setDuration(props.agenda.template.duration);
      setTempId(props.agenda.template._id);
    } else {
      setTempId("");
      setTableRows([
        {
          days: [
            {
              dayIndex: 0,
              cells: [],
            },
            {
              dayIndex: 1,
              cells: [],
            },
            {
              dayIndex: 2,
              cells: [],
            },
            {
              dayIndex: 3,
              cells: [],
            },
            {
              dayIndex: 4,
              cells: [],
            },
            {
              dayIndex: 5,
              cells: [],
            },
            {
              dayIndex: 6,
              cells: [],
            },
          ],
        },
      ]);
    }
  }, [props]);

  return (
    <>
      <Modal
        open={action !== ""}
        onClose={() => setAction("")}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={action !== ""}>
          <div>
            {action === "ADD_CELL" ? (
              <div className={"modal open small"}>
                <AddCell
                  setAction={setAction}
                  addCell={addCell}
                  cellInfo={cellInfo}
                  setCellInfo={setCellInfo}
                  agenda={props.agenda}
                />
              </div>
            ) : action === "REMOVE_CELL" ? (
              <>
                <div className={"modal open small"}>
                  <RemoveCell
                    setAction={setAction}
                    removeCell={removeCell}
                    cellInfo={cellInfo}
                    agenda={props.agenda}
                  />
                </div>
              </>
            ) : null}
          </div>
        </Fade>
      </Modal>

      <div>
        <h1>configuration d'agenda: {props.agenda.name}</h1>
        <div className="row space-between">
          <div className="row">
            <label>durée: </label>&nbsp;
            <input
              min="1"
              style={{ width: "50px" }}
              required
              className="dateInput"
              type="number"
              onChange={(e) => {
                setDuration(e.target.value);
              }}
              value={duration}
            />
          </div>
          {tableRows !==
          [
            {
              days: [
                {
                  dayIndex: 0,
                  cells: [],
                },
                {
                  dayIndex: 1,
                  cells: [],
                },
                {
                  dayIndex: 2,
                  cells: [],
                },
                {
                  dayIndex: 3,
                  cells: [],
                },
                {
                  dayIndex: 4,
                  cells: [],
                },
                {
                  dayIndex: 5,
                  cells: [],
                },
                {
                  dayIndex: 6,
                  cells: [],
                },
              ],
            },
          ] ? (
            <RotateLeftIcon
              style={{ cursor: "pointer" }}
              onClick={() =>
                setTableRows([
                  {
                    days: [
                      {
                        dayIndex: 0,
                        cells: [],
                      },
                      {
                        dayIndex: 1,
                        cells: [],
                      },
                      {
                        dayIndex: 2,
                        cells: [],
                      },
                      {
                        dayIndex: 3,
                        cells: [],
                      },
                      {
                        dayIndex: 4,
                        cells: [],
                      },
                      {
                        dayIndex: 5,
                        cells: [],
                      },
                      {
                        dayIndex: 6,
                        cells: [],
                      },
                    ],
                  },
                ])
              }
              color="secondary"
            />
          ) : null}
        </div>

        <section className={styles.agendaContainer}>
          <div className="scrollable">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <div className={styles.day}>
                      Lundi
                      {copiedColIndex === null ? (
                        <ContentCopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(0);
                          }}
                        />
                      ) : copiedColIndex === 0 ? (
                        <HighlightOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(null);
                          }}
                        />
                      ) : (
                        <ContentPasteIcon
                          onClick={() => {
                            pasteCol(0);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  </th>
                  <th>
                    <div className={styles.day}>
                      Mardi
                      {copiedColIndex === null ? (
                        <ContentCopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(1);
                          }}
                        />
                      ) : copiedColIndex === 1 ? (
                        <HighlightOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(null);
                          }}
                        />
                      ) : (
                        <ContentPasteIcon
                          onClick={() => {
                            pasteCol(1);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  </th>
                  <th>
                    <div className={styles.day}>
                      Mercredi
                      {copiedColIndex === null ? (
                        <ContentCopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(2);
                          }}
                        />
                      ) : copiedColIndex === 2 ? (
                        <HighlightOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(null);
                          }}
                        />
                      ) : (
                        <ContentPasteIcon
                          onClick={() => {
                            pasteCol(2);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  </th>
                  <th>
                    <div className={styles.day}>
                      Jeudi
                      {copiedColIndex === null ? (
                        <ContentCopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(3);
                          }}
                        />
                      ) : copiedColIndex === 3 ? (
                        <HighlightOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(null);
                          }}
                        />
                      ) : (
                        <ContentPasteIcon
                          onClick={() => {
                            pasteCol(3);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  </th>
                  <th>
                    <div className={styles.day}>
                      Vendredi
                      {copiedColIndex === null ? (
                        <ContentCopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(4);
                          }}
                        />
                      ) : copiedColIndex === 4 ? (
                        <HighlightOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setCopiedColIndex(null);
                          }}
                        />
                      ) : (
                        <ContentPasteIcon
                          onClick={() => {
                            pasteCol(4);
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  </th>
                  {props.agenda.establishment.weekend.includes(6) ? null : (
                    <th>
                      <div className={styles.day}>
                        Samedi
                        {copiedColIndex === null ? (
                          <ContentCopyIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setCopiedColIndex(5);
                            }}
                          />
                        ) : copiedColIndex === 5 ? (
                          <HighlightOffIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setCopiedColIndex(null);
                            }}
                          />
                        ) : (
                          <ContentPasteIcon
                            onClick={() => {
                              pasteCol(5);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                    </th>
                  )}
                  {props.agenda.establishment.weekend.includes(0) ? null : (
                    <th>
                      <div className={styles.day}>
                        Dimanche
                        {copiedColIndex === null ? (
                          <ContentCopyIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setCopiedColIndex(6);
                            }}
                          />
                        ) : copiedColIndex === 6 ? (
                          <HighlightOffIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setCopiedColIndex(null);
                            }}
                          />
                        ) : (
                          <ContentPasteIcon
                            onClick={() => {
                              pasteCol(6);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>
                          <p>
                            {moment(
                              `${props.agenda.establishment.startHour}:00`,
                              [moment.ISO_8601, "HH:mm"]
                            )
                              .add(
                                index !== 0 ? duration * index : 0,
                                "minutes"
                              )
                              .format("HH:mm")}
                          </p>
                          <p>
                            {copiedRowIndex === null ? (
                              <ContentCopyIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setCopiedRowIndex(index);
                                }}
                              />
                            ) : copiedRowIndex === index ? (
                              <HighlightOffIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setCopiedRowIndex(null);
                                }}
                              />
                            ) : (
                              <ContentPasteIcon
                                onClick={() => {
                                  pasteRow(
                                    index,
                                    moment(
                                      `${props.agenda.establishment.startHour}:00`,
                                      [moment.ISO_8601, "HH:mm"]
                                    )
                                      .add(
                                        index !== 0 ? duration * index : 0,
                                        "minutes"
                                      )
                                      .format("HH:mm"),
                                    moment(
                                      `${props.agenda.establishment.startHour}:00`,
                                      [moment.ISO_8601, "HH:mm"]
                                    )
                                      .add(duration * (index + 1), "minutes")
                                      .format("HH:mm")
                                  );
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </p>
                        </td>
                        <td>
                          <div className={styles.cell}>
                            <AddIcon
                              fontSize="large"
                              className={styles.icon}
                              color="secondary"
                              onClick={() => {
                                configCell(row, index, 0);
                              }}
                            />
                            {row.days
                              .find((day) => day.dayIndex === 0)
                              ?.cells?.map((cell) => {
                                let result = [];
                                for (let i = 0; i < cell.Qty; i++) {
                                  result.push({
                                    cellIndex: i,
                                    type: cell.type,
                                  });
                                }
                                return result.map((res) => (
                                  <div
                                    style={{
                                      backgroundColor: types?.find(
                                        (type) => type._id === res.type
                                      )?.color,
                                    }}
                                    className={styles.col}
                                    key={res.cellIndex}
                                  >
                                    {
                                      types?.find(
                                        (type) => type._id === res.type
                                      )?.name
                                    }
                                    <div className={styles.overlay}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCellInfo({
                                            row: row,
                                            type: res.type,
                                            cellIndex: 0,
                                          });
                                          setAction("REMOVE_CELL");
                                        }}
                                        className={styles.btn}
                                        style={{ color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                ));
                              })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.cell}>
                            <AddIcon
                              fontSize="large"
                              className={styles.icon}
                              color="secondary"
                              onClick={() => {
                                configCell(row, index, 1);
                              }}
                            />
                            {row.days
                              .find((day) => day.dayIndex === 1)
                              ?.cells?.map((cell) => {
                                let result = [];
                                for (let i = 0; i < cell.Qty; i++) {
                                  result.push({
                                    cellIndex: i,
                                    type: cell.type,
                                  });
                                }
                                return result.map((res) => (
                                  <div
                                    style={{
                                      backgroundColor: types?.find(
                                        (type) => type._id === res.type
                                      )?.color,
                                    }}
                                    className={styles.col}
                                    key={res.cellIndex}
                                  >
                                    {
                                      types?.find(
                                        (type) => type._id === res.type
                                      )?.name
                                    }
                                    <div className={styles.overlay}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCellInfo({
                                            row: row,
                                            type: res.type,
                                            cellIndex: 1,
                                          });
                                          setAction("REMOVE_CELL");
                                        }}
                                        className={styles.btn}
                                        style={{ color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                ));
                              })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.cell}>
                            <AddIcon
                              fontSize="large"
                              className={styles.icon}
                              color="secondary"
                              onClick={() => {
                                configCell(row, index, 2);
                              }}
                            />
                            {row.days
                              .find((day) => day.dayIndex === 2)
                              ?.cells?.map((cell) => {
                                let result = [];

                                for (let i = 0; i < cell.Qty; i++) {
                                  result.push({
                                    cellIndex: i,
                                    type: cell.type,
                                  });
                                }
                                return result.map((res) => (
                                  <div
                                    style={{
                                      backgroundColor: types?.find(
                                        (type) => type._id === res.type
                                      )?.color,
                                    }}
                                    className={styles.col}
                                    key={res.cellIndex}
                                  >
                                    {
                                      types?.find(
                                        (type) => type._id === res.type
                                      )?.name
                                    }
                                    <div className={styles.overlay}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCellInfo({
                                            row: row,
                                            type: res.type,
                                            cellIndex: 2,
                                          });
                                          setAction("REMOVE_CELL");
                                        }}
                                        className={styles.btn}
                                        style={{ color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                ));
                              })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.cell}>
                            <AddIcon
                              fontSize="large"
                              className={styles.icon}
                              color="secondary"
                              onClick={() => {
                                configCell(row, index, 3);
                              }}
                            />
                            {row.days
                              .find((day) => day.dayIndex === 3)
                              ?.cells?.map((cell) => {
                                let result = [];
                                for (let i = 0; i < cell.Qty; i++) {
                                  result.push({
                                    cellIndex: i,
                                    type: cell.type,
                                  });
                                }
                                return result.map((res) => (
                                  <div
                                    style={{
                                      backgroundColor: types?.find(
                                        (type) => type._id === res.type
                                      )?.color,
                                    }}
                                    className={styles.col}
                                    key={res.cellIndex}
                                  >
                                    {
                                      types?.find(
                                        (type) => type._id === res.type
                                      )?.name
                                    }
                                    <div className={styles.overlay}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCellInfo({
                                            row: row,
                                            type: res.type,
                                            cellIndex: 3,
                                          });
                                          setAction("REMOVE_CELL");
                                        }}
                                        className={styles.btn}
                                        style={{ color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                ));
                              })}
                          </div>
                        </td>
                        <td>
                          <div className={styles.cell}>
                            <AddIcon
                              fontSize="large"
                              className={styles.icon}
                              color="secondary"
                              onClick={() => {
                                configCell(row, index, 4);
                              }}
                            />
                            {row.days
                              .find((day) => day.dayIndex === 4)
                              ?.cells?.map((cell) => {
                                let result = [];
                                for (let i = 0; i < cell.Qty; i++) {
                                  result.push({
                                    cellIndex: i,
                                    type: cell.type,
                                  });
                                }

                                return result.map((res) => (
                                  <div
                                    style={{
                                      backgroundColor: types?.find(
                                        (type) => type._id === res.type
                                      )?.color,
                                    }}
                                    className={styles.col}
                                    key={res.cellIndex}
                                  >
                                    {
                                      types?.find(
                                        (type) => type._id === res.type
                                      )?.name
                                    }
                                    <div className={styles.overlay}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCellInfo({
                                            row: row,
                                            type: res.type,
                                            cellIndex: 4,
                                          });
                                          setAction("REMOVE_CELL");
                                        }}
                                        className={styles.btn}
                                        style={{ color: "#fff" }}
                                      />
                                    </div>
                                  </div>
                                ));
                              })}
                          </div>
                        </td>
                        {props.agenda.establishment.weekend.includes(
                          6
                        ) ? null : (
                          <td>
                            <div className={styles.cell}>
                              <AddIcon
                                fontSize="large"
                                className={styles.icon}
                                color="secondary"
                                onClick={() => {
                                  configCell(row, index, 5);
                                }}
                              />
                              {row.days
                                .find((day) => day.dayIndex === 5)
                                ?.cells?.map((cell) => {
                                  let result = [];
                                  for (let i = 0; i < cell.Qty; i++) {
                                    result.push({
                                      cellIndex: i,
                                      type: cell.type,
                                    });
                                  }
                                  return result.map((res) => (
                                    <div
                                      style={{
                                        backgroundColor: types?.find(
                                          (type) => type._id === res.type
                                        )?.color,
                                      }}
                                      className={styles.col}
                                      key={res.cellIndex}
                                    >
                                      {
                                        types?.find(
                                          (type) => type._id === res.type
                                        )?.name
                                      }
                                      <div className={styles.overlay}>
                                        <DeleteIcon
                                          onClick={() => {
                                            setCellInfo({
                                              row: row,
                                              type: res.type,
                                              cellIndex: 5,
                                            });
                                            setAction("REMOVE_CELL");
                                          }}
                                          className={styles.btn}
                                          style={{ color: "#fff" }}
                                        />
                                      </div>
                                    </div>
                                  ));
                                })}
                            </div>
                          </td>
                        )}
                        {props.agenda.establishment.weekend.includes(
                          0
                        ) ? null : (
                          <td>
                            <div className={styles.cell}>
                              <AddIcon
                                fontSize="large"
                                className={styles.icon}
                                color="secondary"
                                onClick={() => {
                                  configCell(row, index, 6);
                                }}
                              />
                              {row.days
                                .find((day) => day.dayIndex === 6)
                                ?.cells?.map((cell) => {
                                  let result = [];
                                  for (let i = 0; i < cell.Qty; i++) {
                                    result.push({
                                      cellIndex: i,
                                      type: cell.type,
                                    });
                                  }
                                  return result.map((res) => (
                                    <div
                                      style={{
                                        backgroundColor: types?.find(
                                          (type) => type._id === res.type
                                        )?.color,
                                      }}
                                      className={styles.col}
                                      key={res.cellIndex}
                                    >
                                      {
                                        types?.find(
                                          (type) => type._id === res.type
                                        )?.name
                                      }
                                      <div className={styles.overlay}>
                                        <DeleteIcon
                                          onClick={() => {
                                            setCellInfo({
                                              row: row,
                                              type: res.type,
                                              cellIndex: 6,
                                            });
                                            setAction("REMOVE_CELL");
                                          }}
                                          className={styles.btn}
                                          style={{ color: "#fff" }}
                                        />
                                      </div>
                                    </div>
                                  ));
                                })}
                            </div>
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          {tableRows.length - 1 === index &&
                          moment(`${props.agenda.establishment.endHour}:00`, [
                            moment.ISO_8601,
                            "HH:mm",
                          ]).format("HH:mm") !==
                            moment(
                              `${props.agenda.establishment.startHour}:00`,
                              [moment.ISO_8601, "HH:mm"]
                            )
                              .add(
                                index !== 0 ? duration * index : 0,
                                "minutes"
                              )
                              .format("HH:mm") ? (
                            <div className={styles.addRow}>
                              <AddIcon
                                onClick={() => {
                                  addRow();
                                }}
                                fontSize="large"
                                className={styles.icon}
                                color="secondary"
                              />
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <div className="row">
          {loading ? (
            <div className="spinner">
              <CircularProgress />
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  configAgenda();
                }}
                className="defaultBtn"
              >
                confirmer
              </button>
              &nbsp;
              <button
                onClick={() => {
                  toggleModal();
                }}
                className="cancelBtn"
              >
                annuler
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ConfigAgenda;
