export function mock(path, jwt, options) {
  const id = path.split("/")[2];
  switch (id) {
    case "1":
      return {
        status: 200,
        data: [
          {
            id: 1,
            filename: "Test.stl",
            comment: "",
            isValid: null,
            creationDate: "2023-06-18T08:00:24.000Z",
            modificationDate: "2023-06-18T08:00:24.000Z",
            idprinter: null,
            printerName: null,
          },
        ],
      };

    default:
      return { error: true };
  }
}
