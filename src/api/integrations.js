// Simulando os serviços, sem Base44

export const SendEmail = {
  async send(data) {
    console.log("Simulando envio de e-mail", data);
    return { success: true };
  }
};

export const UploadFile = {
  async upload(file) {
    console.log("Simulando upload de arquivo", file);
    return { url: "https://fakeurl.com/arquivo.pdf" };
  }
};

// Simulações adicionais conforme necessidade
