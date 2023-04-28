(self.MyAsyncLib = self.MyAsyncLib || []).push([
  "bar",
  (lib) => {
    lib.log("Component bar initialized! (#2, depends on foo)");
  },
  [ "foo" ]
]);
