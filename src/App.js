import logo from "./logo.svg";
import "./App.css";
import { JaaSMeeting, JitsiMeeting } from "@jitsi/react-sdk";
import { useState, useRef } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function App() {
  const YOUR_APP_ID = "<YOUR_APP_ID>";
  const apiRef = useRef();
  const [logItems, updateLog] = useState([]);
  const [show, toggleShow] = useState(false);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);
  const [disableSelfView, setDisableSelfView] = useState(false)

  const printEventOutput = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
  };

  const handleAudioStatusChange = (payload, feature) => {
    if (payload.muted) {
      updateLog((items) => [...items, `${feature} off`]);
    } else {
      updateLog((items) => [...items, `${feature} on`]);
    }
  };

  const handleChatUpdates = (payload) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    apiRef.current.executeCommand("toggleChat");
    updateLog((items) => [
      ...items,
      `you have ${payload.unreadCount} unread messages`,
    ]);
  };

  const handleKnockingParticipant = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    updateKnockingParticipants((participants) => [
      ...participants,
      payload?.participant,
    ]);
  };

  const handleJaaSIFrameRef = (iframeRef) => {
    iframeRef.style.border = "10px solid #3d3d3d";
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = "100%";
    // iframeRef.style.width = "170px";
    iframeRef.style.marginBottom = "20px";
  };

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
    apiRef.current.on("audioMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "audio")
    );
    apiRef.current.on("videoMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "video")
    );
    apiRef.current.on("raiseHandUpdated", printEventOutput);
    apiRef.current.on("titleViewChanged", printEventOutput);
    apiRef.current.on("chatUpdated", handleChatUpdates);
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
    apiRef.current.on("toolbarButtonClicked", (payload) => {
      updateLog((items) => [...items, `${JSON.stringify(payload)}`])
      apiRef.current.executeCommand('localSubject', 'New Conference Local Subject');

    });

  };

  const handleReadyToClose = () => {
    /* eslint-disable-next-line no-alert */
    alert("Ready to close...");
  };

  const generateRoomName = () => "hussein-test-jitsi-wwwwwwwewewe";
  // `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

  const renderButtons = () => (
    <div style={{ margin: "15px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="text"
          title="Click to execute toggle raise hand command"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#f8ae1a",
            color: "#040404",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => {
            apiRef.current.executeCommand('overwriteConfig',
              {
                disableSelfView: !disableSelfView
              });
            setDisableSelfView(!disableSelfView)
          }}
        >
          Toggle Self View {disableSelfView.toString()}
        </button>
        <button
          type="text"
          title="Click to execute toggle raise hand command"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#f8ae1a",
            color: "#040404",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => apiRef.current.executeCommand("toggleRaiseHand")}
        >
          Raise hand
        </button>
        <button
          type="text"
          title="Click to execute toggle raise hand command"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#f8ae1a",
            color: "#040404",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => {
            const ps = apiRef.current.getParticipantsInfo();
            const pid = ps.find(p => p.formattedDisplayName.includes("(me)")).participantId
            console.log(pid);
            apiRef.current.executeCommand('grantModerator', pid)
          }}
        >
          Grant Moderator
        </button>
        <button
          type="text"
          title="Click to create a new JitsiMeeting instance"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#3D3D3D",
            color: "white",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => toggleShow(!show)}
        >
          Toggle new instance
        </button>

        <button
          type="text"
          title="Click to create a new JitsiMeeting instance"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#3D3D3D",
            color: "white",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => toggleShow(!show)}
        >
          Close Call
        </button>
      </div>
    </div>
  );

  const renderLog = () =>
    logItems.map((item, index) => (
      <div
        style={{
          fontFamily: "monospace",
          padding: "5px",
        }}
        key={index}
      >
        {item}
      </div>
    ));

  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );

  return (
    <>
      <h1
        style={{
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        JitsiMeeting Demo App
      </h1>
      {show && (
        <div style={{ height: "800px" }}>
          <Allotment>
            <Allotment.Pane minSize={200}>
              <Allotment vertical={true}>
                <Allotment.Pane minSize={200}>
                  <JitsiMeeting
                    domain = { "meet.adamdotaiqa.space" }
                    roomName={generateRoomName()}
                    jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6Ijxpc3N1ZXIgand0PiIsImV4cCI6MTY2NzMxNjYxNywibmJmIjoxNjY3MzA5NDEyLCJyb29tIjoiKiIsInN1YiI6IioiLCJjb250ZXh0Ijp7InVzZXIiOnsibW9kZXJhdG9yIjoidHJ1ZSIsImlkIjoiYTFhM2RkMWQtYTRjNS00ZTdhLWFkNWYtZDg5MTA4NWY2ZjFkIiwibmFtZSI6Im15IHVzZXIgbmFtZSIsImVtYWlsIjoibXkgdXNlciBlbWFpbCIsImF2YXRhciI6Imh0dHBzOi8vdjQuYWRhbWRvdGFpcWEuc3BhY2UvaW1hZ2VzL2xvZ28ucG5nIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOiJ0cnVlIiwicmVjb3JkaW5nIjoidHJ1ZSIsIm91dGJvdW5kLWNhbGwiOiJ0cnVlIiwidHJhbnNjcmlwdGlvbiI6InRydWUifX19.2YImmvUcvEWJOhvBGXwyxu9zmMiE0skGP2puAchf1y4"
                
                    // userInfo={{
                    //   displayName: "YOUR_USERNAME",
                    // }}
                    // // configOverwrite={{
                    //   prejoinPageEnabled: false,
                    //   disableSelfView: disableSelfView,
                    //   // disableSelfViewSettings: true,
                    //   toolbarButtons: [
                    //     'localrecording',
                    //     'camera',
                    //     'chat',
                    //     'closedcaptions',
                    //     'desktop',
                    //     // 'dock-iframe',
                    //     'download',
                    //     // 'embedmeeting',
                    //     // 'etherpad',
                    //     // 'feedback',
                    //     'filmstrip',
                    //     'fullscreen',
                    //     'hangup',
                    //     'help',
                    //     'highlight',
                    //     'invite',
                    //     // 'linktosalesforce',
                    //     'livestreaming',
                    //     'microphone',
                    //     'noisesuppression',
                    //     'participants-pane',
                    //     'profile',
                    //     'raisehand',
                    //     'recording',
                    //     'security',
                    //     'select-background',
                    //     'settings',
                    //     'shareaudio',
                    //     'sharedvideo',
                    //     'shortcuts',
                    //     'stats',
                    //     'tileview',
                    //     'toggle-camera',
                    //     // 'undock-iframe',
                    //     'videoquality',
                    //   ],
                    //   // Options related to the remote participant menu.
                    //   remoteVideoMenu: {
                    //     // Whether the remote video context menu to be rendered or not.
                    //     disabled: true,
                    //     // If set to true the 'Kick out' button will be disabled.
                    //     disableKick: true,
                    //     // If set to true the 'Grant moderator' button will be disabled.
                    //     disableGrantModerator: true,
                    //     // If set to true the 'Send private message' button will be disabled.
                    //     disablePrivateChat: true,
                    //   },
                    //   // Options related to the breakout rooms feature.
                    //   breakoutRooms: {
                    //     // Hides the add breakout room button. This replaces `hideAddRoomButton`.
                    //     hideAddRoomButton: false,
                    //     // Hides the auto assign participants button.
                    //     hideAutoAssignButton: false,
                    //     // Hides the join breakout room button.
                    //     hideJoinRoomButton: false,
                    //   },

                    //   buttonsWithNotifyClick: [
                    //     //     'camera',
                    //     //     {
                    //     //         key: 'chat',
                    //     //         preventExecution: false
                    //     //     },
                    //     //     {
                    //     //         key: 'closedcaptions',
                    //     //         preventExecution: true
                    //     //     },
                    //     //     'desktop',
                    //     //     'download',
                    //     //     'embedmeeting',
                    //     //     'etherpad',
                    //     //     'feedback',
                    //     //     'filmstrip',
                    //     //     'fullscreen',
                    //     //     'hangup',
                    //     //     'help',
                    //     //     {
                    //     //         key: 'invite',
                    //     //         preventExecution: false
                    //     //     },
                    //     //     'livestreaming',
                    //     //     'microphone',
                    //     //     'mute-everyone',
                    //     //     'mute-video-everyone',
                    //     //     'noisesuppression',
                    //     //     'participants-pane',
                    //     //     'profile',
                    //     //     {
                    //     //         key: 'raisehand',
                    //     //         preventExecution: true
                    //     //     },
                    //     //     'recording',
                    //     //     'security',
                    //     //     'select-background',
                    //     // 'settings',
                    //     {
                    //       key: 'settings',
                    //       preventExecution: true
                    //     },
                    //     //     'shareaudio',
                    //     //     'sharedvideo',
                    //     //     'shortcuts',
                    //     //     'stats',
                    //     //     'tileview',
                    //     //     'toggle-camera',
                    //     //     'videoquality',
                    //     //     // The add passcode button from the security dialog.
                    //     //     {
                    //     //         key: 'add-passcode',
                    //     //         preventExecution: false
                    //     //     },
                    //   ],
                    //   localRecording: {
                    //     // Enables local recording.
                    //     // Additionally, 'localrecording' (all lowercase) needs to be added to
                    //     // the `toolbarButtons`-array for the Local Recording button to show up
                    //     // on the toolbar.
                    //     //
                    //     enabled: true
                    //   }
                    // }}
                    // release = 'release-3110' // Update this with the version of interest.
                    // useStaging={true}
                    onReadyToClose={handleReadyToClose}
                    getIFrameRef={handleJaaSIFrameRef}
                    onApiReady={handleApiReady}
                    spinner={renderSpinner}
                  />
                </Allotment.Pane>
                <Allotment.Pane snap>
                  <div></div>
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>
            <Allotment.Pane snap>
              <div></div>
            </Allotment.Pane>
          </Allotment>
        </div>
      )}
      {renderButtons()}
      {renderLog()}
    </>
  );
}

export default App;
