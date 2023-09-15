import { useEffect } from "react";
import { Drivers, Storage } from "@ionic/storage";

export function useStorage() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage({
        name: "__mydb",
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
      });
      const store = await newStore.create();
      setStore(store);
    };
  }, []);
}
