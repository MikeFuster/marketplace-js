import "./App.css";
import { Marketplace, Integration } from "@fusebit/react-marketplace";
import { useEffect, useState } from "react";

interface Data {
  tenantId: string;
  integrationsApiUrl: string;
  installUrlApiUrl: string;
  uninstallApiUrl: string;
}

const App = () => {
  const [data, setData] = useState<Data>();
  const [toggleMarketplace, setToggleMarketplace] = useState(false);

  useEffect(() => {
    const handleMessage = (e: any) => {
      // const message = JSON.parse(e.data);
      if (e.origin !== window.origin) {
        console.log(e.data);
        setData(e.data);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getIntegrations = async () => {
    const url = data?.integrationsApiUrl.replace(
      "{tenantId}",
      data.tenantId || ""
    );
    const res = await fetch(url || "");
    const integrations: Integration[] = await res.json();
    return integrations;
  };

  const getInstallUrl = async (integration: string) => {
    const url = data?.installUrlApiUrl
      .replace("{integrationId}", integration)
      .replace("{tenantId}", data.tenantId || "");
    const res = await fetch(url || "");
    const install = await res.json();
    return install.targetUrl;
  };

  const onUninstallClick = async (integration: string) => {
    const url = data?.uninstallApiUrl
      .replace("{integrationId}", integration)
      .replace("{tenantId}", data.tenantId || "");
    const res = await fetch(url || "", { method: "DELETE" });
    if (res.status === 200) {
      setToggleMarketplace(true);
      setTimeout(() => {
        setToggleMarketplace(false);
      }, 250);
    }
  };

  return (
    <div className="App">
      {data && !toggleMarketplace && (
        <Marketplace
          onUninstallClick={onUninstallClick}
          getInstallUrl={getInstallUrl}
          getIntegrations={getIntegrations}
        />
      )}
    </div>
  );
};

export default App;
