(self.MyAsyncLib = self.MyAsyncLib || []).push([
  "foo",
  (lib) => {
    lib.log("Component foo initialized!");
  },
  []
]);
