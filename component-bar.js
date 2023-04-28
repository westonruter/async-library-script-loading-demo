(self.MyAsyncLib = self.MyAsyncLib || []).push([
  "bar",
  (lib) => {
    lib.log("Component bar initialized!");
  },
  [ "foo" ]
]);
