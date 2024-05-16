// KeycloakProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {
    const [keycloak, setKeycloak] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    const keycloakInit = () => {
        const initOptions = {
            url: 'http://localhost:8080/',
            realm: 'test',
            clientId: 'react-client',
            onLoad: 'check-sso',
            KeycloakResponseType: 'code',
            silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
            checkLoginIframe: false,
            pkceMethod: 'S256'
        };

        const kc = new Keycloak(initOptions);

        kc.init({
            KeycloakResponseType: 'code',
            silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", checkLoginIframe: false,
            pkceMethod: 'S256'
        })
            .then(auth => {
                    console.info("Authenticated");
                    setAuthenticated(true);
                    console.log(kc);
                    setKeycloak(kc);
                    kc.onTokenExpired = () => {
                        console.log('Token expired');
                    };
            })
            .catch(() => {
                console.error("Authentication Failed");
            });
    }
    useEffect(() => {
        keycloakInit()
    }, [keycloak]);

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
};

export const useKeycloak = () => useContext(KeycloakContext);
