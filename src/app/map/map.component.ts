import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent {
  @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;
  markers: Marker[] = [];
  poa: google.maps.LatLngLiteral = { lat: -30.0346, lng: -51.2177 };// Coordenadas para Porto Alegre, Brasil
  boraSocial: google.maps.LatLngLiteral = { lat: -30.0540572, lng: -51.1477079 };// Coordenadas para Porto Alegre, Brasil
  center: google.maps.LatLngLiteral = this.boraSocial;

  mapOptions: google.maps.MapOptions = {
    center: this.boraSocial,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    /*disableDefaultUI: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: true,
    zoomControl: false,*/
  };
  ngAfterViewInit(): void {
    if(this.googleMap){
      var placesService = new google.maps.places.PlacesService(this.googleMap.googleMap!);
      var request = {
          query: 'Bora Social!, Porto Alegre, Brazil',
          fields: ['place_id', 'geometry', 'name']
      };

      placesService.findPlaceFromQuery(request, (places: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              const place = places![0];
              const marker = new google.maps.Marker({
                map: this.googleMap.googleMap,
                title: place.name,
                position: place.geometry?.location,
              });
              marker.addListener('click', () => {
                this.openInfoWindow(marker, place);
              });
              this.openInfoWindow(marker, place);
          }
      });
    }
  }

  openInfoWindow(marker: google.maps.Marker, place: google.maps.places.PlaceResult): void {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h5>Bora Work e Bora Social!</h5>
          <p>
            <b>bora.work</b> é uma plataforma de <b>consultoria</b> e <b>networking</b> que facilita a <b>organização</b> e <b>desenvolvimento</b> de <b>encontros, palestras e projetos de tecnologia e inovação</b>.
            <!--Atuamos em diversos locais, como <b>coworkings, restaurantes e plataformas digitais (Google Meet, Discord e WhatsApp)</b>. Proporcionamos <b>experiências únicas</b> que <b>conectam pessoas</b>, promovendo o crescimento <b>profissional</b> e a <b>expansão</b> da rede de contatos em ambientes acolhedores e confortáveis. Junte-se a nós e descubra como <b>transformar suas ideias em realidade.</b>-->
            <br/>
            <br/>
            <b>bora.social</b> são os encontros sociais com <b>Parceiros</b> do <b>Bora!</b>
          </p>
          <h7>
            <b>
              Onde fica? <br /> 
              Fica no '${place.name}' na Luggo do Bairro Jardim Carvalho
            </b>
          </h7>
          <br />
          <br />
          <nav class="text-center">
            <a class='btn btn-dark' href="/bora.work">Bora Work!</a>
            <a class='btn btn-dark' href="/lucasfogliarini">Bora Social!</a>
          </nav>
          <br />
        </div>
      `
    });

    infoWindow.open(this.googleMap.googleMap, marker);
  }
}

interface Marker {
  position: google.maps.LatLng;
  title: string;
  content?: string;
  showInfo?: boolean;
}