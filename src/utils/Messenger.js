import axios from "axios";

export async function sendMessage(
  sender,
  receiver,
  text,
  establishment,
  patient
) {
  const { data } = await axios.post("/messenger/sendmessage", {
    sender: sender,
    receiver: receiver,
    text: text,
    establishment: establishment,
    patient: patient,
  });
  return data;
}
