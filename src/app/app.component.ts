import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pc:RTCPeerConnection;
  constructor(private httpClient:HttpClient){

  }
  ngOnInit(): void {
    console.log("hola");
    this.pc = new RTCPeerConnection()
    this.pc.addTransceiver('video')

    let log = msg => {
        document.getElementById('logs').innerHTML += msg + '<br>'
    }
    this.pc.oniceconnectionstatechange = () => log(this.pc.iceConnectionState)
    this.pc.ontrack = function (event) {
        let el =document.createElement(event.track.kind) as HTMLVideoElement;
        el.srcObject = event.streams[0]
        console.log(event)
        console.log(event.streams[0])
        el.autoplay = true
        el.controls = true

        document.getElementById('remoteVideos').appendChild(el)
    }

    

    this.doSignaling(false)
  }
  title = 'proyectoCamara';
  doSignaling = iceRestart => {
    console.log({iceRestart});
    this.pc.createOffer({iceRestart})
        .then(offer => {
          this.pc.setLocalDescription(offer)
          
          console.log(JSON.stringify(offer));
            return this.httpClient.post("http://localhost:8080/doSignaling",JSON.stringify(offer)).subscribe(res=>{
              console.log(res);
              this.pc.setRemoteDescription(res); console.log(res);
            });
        })
       // .then(res => {this.pc.setRemoteDescription(res); console.log(res)})
        .catch(alert)
}
  convert(){
   // const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    //const peerConnection = new RTCPeerConnection(configuration);
  }
}
