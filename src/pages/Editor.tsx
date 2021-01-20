import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  useIonViewWillEnter,
} from '@ionic/react';

import { useHistory, useParams } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './Editor.css';

import { save, trashBin } from 'ionicons/icons';
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from '@capacitor/core';

const EditorPage: React.FC = () => {
  const [state, setState] = useState('');
  const history = useHistory();
  const params = useParams<{ name: string }>();

  useIonViewWillEnter(async () => {
    const { Filesystem } = Plugins;
    const file = params.name;
    if (file) {
      const { data } = await Filesystem.readFile({
        path: `notes/${file}`,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8,
      });
      setState(data);
    }
  });
  const deleteFile = async () => {
    const { Filesystem } = Plugins;
    const file = params.name;
    if (file) {
      await Filesystem.deleteFile({
        path: `notes/${file}`,
        directory: FilesystemDirectory.Documents,
      });
      history.goBack();
    }
  };
  const saveFile = async () => {
    const { Filesystem } = Plugins;
    const file = params.name ? params.name : `note-${Date.now()}.txt`;
    await Filesystem.writeFile({
      path: `notes/${file}`,
      data: state,
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    });
    history.goBack();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={saveFile}>
              <IonIcon icon={save} />
            </IonButton>
            { params.name ? <IonButton onClick={deleteFile}>
                <IonIcon icon={trashBin} />
              </IonButton>
              : null
            }
          </IonButtons>
          <IonTitle>{params.name ? 'Edit' : 'New'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{params.name ? 'Edit' : 'New'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ReactQuill theme="snow" value={state} onChange={setState} />
      </IonContent>
    </IonPage>
  );
};

export default EditorPage;
