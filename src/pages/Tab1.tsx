import React, { useState, useEffect, useCallback } from 'react';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonItem,
  IonIcon,
  useIonViewWillEnter,
} from '@ionic/react';
import { add } from 'ionicons/icons';
const noop = () => {};
const requestPermission = () => Filesystem.requestPermissions();

const makeDir = async () => {
  return await Filesystem.mkdir({
    path: 'notes',
    directory: FilesystemDirectory.Documents,
  });
};
const readDir = async () => {
  return await Filesystem.readdir({
    path: 'notes',
    directory: FilesystemDirectory.Documents,
  });
};
const Tab1: React.FC = () => {
  const [files, setState] = useState<Array<string>>([]);
  const setup = useCallback(() => {
    requestPermission()
    .then((canAccesss) => {
      console.log(canAccesss)
        if (canAccesss) {
          return makeDir();
        }
      })
      .then(noop, noop)
      .then(readDir)
      .then(({ files }) => {
        const formatted = files.sort(
          (a, b) =>
            parseInt(b.replace(/note-/, '').replace(/.txt/, '')) -
            parseInt(a.replace(/note-/, '').replace(/.txt/, ''))
        );
        setState(formatted);
      });
  }, []);
  useEffect(() => setup(), [setup]);
  useIonViewWillEnter(() => setup());
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton routerLink="/new">
              <IonIcon icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notes</IonTitle>
          </IonToolbar>
        </IonHeader>

        {files.map((file, idx) => (
          <IonItem key={idx} routerLink={'/edit/' + file}>
            {file}
          </IonItem>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
