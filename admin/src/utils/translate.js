import axios from "axios";

export const translateText = async (text, from = "ar", to = "en") => {
  try {
    const res = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: from,
          tl: to,
          dt: "t",
          q: text,
        },
      }
    );

    const data = res.data;
    return data[0].map((item) => item[0]).join(" ");
  } catch (err) {
    console.error("ترجمة فشلت:", err);
    return "";
  }
};
