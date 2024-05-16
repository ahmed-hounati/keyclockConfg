// App.js
import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { KeycloakProvider, useKeycloak } from './KeycloakProvider';

const InfoPane = ({ message }) => (
  <div className='grid'>
    <div className='col-2'></div>
    <div className='col-8'>
      <h3>Info Pane</h3>
      <Card>
        <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
          {message}
        </p>
      </Card>
    </div>
    <div className='col-2'></div>
  </div>
);

const AuthButtons = ({ setInfoMessage }) => {
  const { keycloak, authenticated } = useKeycloak();

  console.log(keycloak);

  return (
    <div className="grid">
      <div className="col">
        <Button onClick={() => { setInfoMessage(authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }} className="m-1" label='Is Authenticated' />
        <Button onClick={() => { keycloak.login() }} className='m-1' label='Login' severity="success" />
        <Button onClick={() => { setInfoMessage(keycloak.token) }} className="m-1" label='Show Access Token' severity="info" />
        <Button onClick={() => { setInfoMessage(JSON.stringify(keycloak.tokenParsed)) }} className="m-1" label='Show Parsed Access token' severity="info" />
        <Button onClick={() => { setInfoMessage(keycloak.isTokenExpired(5).toString()) }} className="m-1" label='Check Token expired' severity="warning" />
        <Button onClick={() => { keycloak.updateToken(10).then(refreshed => { setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, () => { setInfoMessage('Refresh Error') }) }} className="m-1" label='Update Token (if about to expire)' />
        <Button onClick={() => { keycloak.logout({ redirectUri: 'http://localhost:3000/' }) }} className="m-1" label='Logout' severity="danger" />
      </div>
    </div>
  );
};

function App() {
  const [infoMessage, setInfoMessage] = useState('');

  return (

      <div className="App">
        <div className='grid'>
          <div className='col-12'>
            <h1>My Awesome React App</h1>
          </div>
          <div className='col-12'>
            <h1 id='app-header-2'>Secured with Keycloak</h1>
          </div>
        </div>
        <AuthButtons setInfoMessage={setInfoMessage} />
        <InfoPane message={infoMessage} />
      </div>
 );
}

export default App;
