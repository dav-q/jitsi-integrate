import React, { Component } from 'react';

class JitsiComponent extends Component {

    // domain = '127.0.0.1:8080';
    domain = 'meet.jit.si';
    api = {};

    
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            user: {
                name: '',
                data:{
                    id:'',
                    phone:''
                }
            },
            password:'',
            role:'',
            isAudioMuted: false,
            isVideoMuted: false,
            startConferenceKuepa:false,
            loadingComponent:true
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    startMeet = () => {
        // console.log('start....',this.state);
        this.setState({startConferenceKuepa:true})
        // return

        let studentButtons=["microphone","hangup"]
        let hostButtons=[
            "camera",
            "chat",
            "closedcaptions",
            "desktop",
            "download",
            "embedmeeting",
            "etherpad",
            "feedback",
            "filmstrip",
            "fullscreen",
            "hangup",
            "help",
            "invite",
            "livestreaming",
            "microphone",
            "mute-everyone",
            "mute-video-everyone",
            "participants-pane",
            "profile",
            "raisehand",
            "recording",
            "security",
            "select-background",
            "settings",
            "shareaudio",
            "sharedvideo",
            "shortcuts",
            "stats",
            "tileview",
            "toggle-camera",
            "videoquality",
            "__end",
        ]

        const options = {
            roomName: this.state.room,
            width: 350,
            height: 350,
            configOverwrite: {
                prejoinPageEnabled: false,
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                toolbarButtons: this.state.role==='moderator'?hostButtons : studentButtons,
                hideConferenceTimer: true,
                subject: 'Matemáticas ciclo VI',
            },
            interfaceConfigOverwrite: {
                // overwrite interface properties
                DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
                TILE_VIEW_MAX_COLUMNS: 2,
                JITSI_WATERMARK_LINK: "https://qalms.kuepa.edu.co/",
                DISABLE_VIDEO_BACKGROUND: false,
                DISPLAY_WELCOME_FOOTER: false,
                DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
                DISPLAY_WELCOME_PAGE_CONTENT: false,
                DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
                SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'calendar', 'sounds' ],

            },
            parentNode: document.querySelector("#jitsi-iframe-kuepa"),
            userInfo: {
                displayName: this.state.user.name,
                email: this.state.user.name + "@kuepa.edu.co",
            },
            onload:this.handleOnload,
        };
        console.log(this.domain,options);
        this.api = new window.JitsiMeetExternalAPI(this.domain, options);

        this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus,
            participantRoleChanged:this.participantRoleChanged
        });

    }    

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;        
        var data= {[name]: value}            
        this.setState(data)

    }

    handleClose = () => {
        console.log("handleClose");
    }

    handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }

    handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }

    handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        this.setState({loadingComponent:false})
        const data = await this.getParticipants();
    }

    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        return this.props.history.push('/thank-you');
    }

    participantRoleChanged= async(participant) => {
        console.log("participant",participant);
    }

    handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    executeCommand(command) {
        this.api.executeCommand(command);;
        if(command == 'hangup') {
            return this.props.history.push('/thank-you');
        }

        if(command == 'toggleAudio') {
            this.setState({ isAudioMuted: !this.state.isAudioMuted });
        }

        if(command == 'toggleVideo') {
            this.setState({ isVideoMuted: !this.state.isVideoMuted });
        }
    }

    handleOnload() {
    }

    componentDidMount() {
        if (this.state.startConferenceKuepa && window.JitsiMeetExternalAPI) {            
            this.startMeet();
        } else {
            // alert('JitsiMeetExternalAPI not loaded');
        }
    }

    showParticipants =async()=>{
        const data = await this.getParticipants();
        await this.api.on('participantRoleChanged', function(abc) {
            console.log( abc );
        });
        console.log(data);
    }

    render() {
        const { isAudioMuted, isVideoMuted } = this.state;
        return (
            <>
                <div
                    className={
                        this.state.startConferenceKuepa ? "show" : "hidden"
                    }
                >
                    <header className="nav-bar">
                        <p className="item-left heading">Jitsi React</p>
                    </header>
                    <div className="content-jitsi">
                        <h1>This data --- Hello {this.state.user.name}</h1>
                        <button onClick={this.showParticipants}>
                            ClickMe!
                        </button>
                        <p>
                            Where does it come from?Contrary to popular belief,
                            Lorem Ipsum is not simply random text. It has roots
                            in a piece of classical Latin literature from 45 BC,
                            making it over 2000 years old. Richard McClintock, a
                            Latin professor at Hampden-Sydney College in
                            Virginia, looked up one of the more obscure Latin
                            words, consectetur, from a Lorem Ipsum passage, and
                            going through the cites of the word in classical
                            literature, discovered the undoubtable source. Lorem
                            Ipsum comes from sections 1.10.32 and 1.10.33 of "de
                            Finibus Bonorum et Malorum" (The Extremes of Good
                            and Evil) by Cicero, written in 45 BC. This book is
                            a treatise on the theory of ethics, very popular
                            during the Renaissance. The first line of Lorem
                            Ipsum, "Lorem ipsum dolor sit amet..", comes from a
                            line in section 1.10.32.The standard chunk of Lorem
                            Ipsum used since the 1500s is reproduced below for
                            those interested. Sections 1.10.32 and 1.10.33 from
                            "de Finibus Bonorum et Malorum" by Cicero are also
                            reproduced in their exact original form, accompanied
                            by English versions from the 1914 translation by H.
                            Rackham.
                        </p>
                        <p>
                            Where does it come from?Contrary to popular belief,
                            Lorem Ipsum is not simply random text. It has roots
                            in a piece of classical Latin literature from 45 BC,
                            making it over 2000 years old. Richard McClintock, a
                            Latin professor at Hampden-Sydney College in
                            Virginia, looked up one of the more obscure Latin
                            words, consectetur, from a Lorem Ipsum passage, and
                            going through the cites of the word in classical
                            literature, discovered the undoubtable source. Lorem
                            Ipsum comes from sections 1.10.32 and 1.10.33 of "de
                            Finibus Bonorum et Malorum" (The Extremes of Good
                            and Evil) by Cicero, written in 45 BC. This book is
                            a treatise on the theory of ethics, very popular
                            during the Renaissance. The first line of Lorem
                            Ipsum, "Lorem ipsum dolor sit amet..", comes from a
                            line in section 1.10.32.The standard chunk of Lorem
                            Ipsum used since the 1500s is reproduced below for
                            those interested. Sections 1.10.32 and 1.10.33 from
                            "de Finibus Bonorum et Malorum" by Cicero are also
                            reproduced in their exact original form, accompanied
                            by English versions from the 1914 translation by H.
                            Rackham.
                        </p>
                        <p>
                            Where does it come from?Contrary to popular belief,
                            Lorem Ipsum is not simply random text. It has roots
                            in a piece of classical Latin literature from 45 BC,
                            making it over 2000 years old. Richard McClintock, a
                            Latin professor at Hampden-Sydney College in
                            Virginia, looked up one of the more obscure Latin
                            words, consectetur, from a Lorem Ipsum passage, and
                            going through the cites of the word in classical
                            literature, discovered the undoubtable source. Lorem
                            Ipsum comes from sections 1.10.32 and 1.10.33 of "de
                            Finibus Bonorum et Malorum" (The Extremes of Good
                            and Evil) by Cicero, written in 45 BC. This book is
                            a treatise on the theory of ethics, very popular
                            during the Renaissance. The first line of Lorem
                            Ipsum, "Lorem ipsum dolor sit amet..", comes from a
                            line in section 1.10.32.The standard chunk of Lorem
                            Ipsum used since the 1500s is reproduced below for
                            those interested. Sections 1.10.32 and 1.10.33 from
                            "de Finibus Bonorum et Malorum" by Cicero are also
                            reproduced in their exact original form, accompanied
                            by English versions from the 1914 translation by H.
                            Rackham.
                        </p>
                    </div>
                    <div className="container-jitsi">
                        {this.state.loadingComponent ? (
                            <h3>Cargando... por favor sea paciente</h3>
                        ) : (
                            ""
                        )}
                        <div id="jitsi-iframe-kuepa"></div>
                        <div className="item-center">
                            <span>*----------*</span>
                        </div>
                        <div className="item-center hidden">
                            <span>&nbsp;&nbsp;</span>
                            <i
                                onClick={() =>
                                    this.executeCommand("toggleAudio")
                                }
                                className={`fas fa-2x grey-color ${
                                    isAudioMuted
                                        ? "fa-microphone-slash"
                                        : "fa-microphone"
                                }`}
                                aria-hidden="true"
                                title="Mute / Unmute"
                            ></i>
                            <i
                                onClick={() => this.executeCommand("hangup")}
                                className="fas fa-phone-slash fa-2x red-color"
                                aria-hidden="true"
                                title="Leave"
                            ></i>
                            <i
                                onClick={() =>
                                    this.executeCommand("toggleVideo")
                                }
                                className={`fas fa-2x grey-color ${
                                    isVideoMuted ? "fa-video-slash" : "fa-video"
                                }`}
                                aria-hidden="true"
                                title="Start / Stop camera"
                            ></i>
                            <i
                                onClick={() =>
                                    this.executeCommand("toggleShareScreen")
                                }
                                className="fas fa-film fa-2x grey-color"
                                aria-hidden="true"
                                title="Share your screen"
                            ></i>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        this.state.startConferenceKuepa ? "hidden" : "show"
                    }
                >
                    <header className="nav-bar">
                        <p className="item-left heading">Jitsi Not Start</p>
                    </header>

                    <div className="item-center form-group">
                        <form>
                            <input
                                id="room"
                                type="text"
                                placeholder="ID sala"
                                name="room"
                                onChange={this.handleInputChange}
                            />
                            {/* <input id='name' type='text' placeholder='Nombre' name="user.name" onChange={(e)=>(this.setState({user:{name:e.target.value}}))} /> */}
                            <input
                                id="name"
                                type="text"
                                placeholder="Nombre"
                                name="name"
                                onChange={(e) =>
                                    this.setState((prevState, props) => ({
                                        user: {
                                            ...prevState.user,
                                            name: e.target.value,
                                        },
                                    }))
                                }
                            />

                            <input
                                id="password"
                                type="text"
                                placeholder="Contraseña (opcional)"
                                name="password"
                                onChange={this.handleInputChange}
                            />

                            <input
                                id="role"
                                type="text"
                                placeholder="Rol"
                                name="role"
                                onChange={this.handleInputChange}
                            />

                            <button
                                onClick={(e) => (
                                    e.preventDefault(), this.startMeet()
                                )}
                                type="submit"
                            >
                                Empezar / unirse
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default JitsiComponent;
