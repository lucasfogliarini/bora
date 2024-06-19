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
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: true,
    zoomControl: false,
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
                const partnerId = Math.floor(Math.random() * 2) + 1;
                if(partnerId == 1)
                  this.openBoraWork(marker, place);
                else if(partnerId == 2)
                  this.openBoraSocial(marker, place);
              });
              this.openBoraWork(marker, place);
          }
      });
    }
  }

  openBoraWork(marker: google.maps.Marker, place: google.maps.places.PlaceResult): void {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h5 class='text-center'>Bora.Work</h5>
          <h6 class='text-center'>Consultoria e Parcerias</h6>
          <br/>
          <nav class="text-center">
            <a class='btn btn-dark' href="/bora.work">Consultoria e encontros</a>
            <a class='btn btn-white' href="/lucasfogliarini">Parceira(o) Destaque</a>
          </nav>
          <br/>
          <p>
            <b>bora.work</b> é uma plataforma de <b>consultoria</b> e <b>parcerias</b> que facilita o <b>entendimento</b>, <b>arquitetura</b>, <b>desenvolvimento</b> e <b>testes</b> de <b>projetos inovadores de tecnologia</b> com <b>qualidade</b>, além de tudo isso, também <b>realiza</b> diversos <b>encontros</b>, incluindo encontros de <b>tecnologia</b> e <b>revitalização da terra</b>.
            Atuamos em diversos locais, como <b>coworkings, casas, restaurantes e plataformas digitais (Google Meet, Discord e WhatsApp)</b>. Proporcionamos <b>experiências únicas</b> que <b>conectam pessoas</b>, promovendo o crescimento <b>profissional</b> e a <b>expansão</b> da rede de contatos em ambientes acolhedores e confortáveis. Junte-se a nós e descubra como <b>transformar suas ideias em realidade.</b>
          </p>
          <div class='text-center'>
            <small>A maioria dos encontros presenciais são em Porto Alegre no</small>
            <br />
            <a class='btn btn-white' target='_blank' href='https://www.google.com/maps/search/?api=1&query=Bora+Social!/'>Bora Cowork!</a>
            <br />
            ⬇️
          </div>
          <br/>
        </div>
      `
    });

    infoWindow.open(this.googleMap.googleMap, marker);
  }

  openBoraSocial(marker: google.maps.Marker, place: google.maps.places.PlaceResult): void {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h5 class='text-center'>Bora Social</h5>
          <h6 class='text-center'>Social e Parcerias</h6>         
          <nav class="text-center">
            <a class='btn btn-white' href="/lucasfogliarini">Encontros</a>
            <a class='btn btn-dark' href="/bora.work">Parcerias</a>
          </nav>
          <br/>
          <p>
            <b>bora.social</b> são os encontros sociais com as <b>Parcerias</b> do <b>Bora!</b>
            <ul>
              <li>Bora Jam (no Bora Social)</li>
              <li>Bora Bola (futebol nos parques)</li>
              <li>Bora Xadrezinho (no Bora Social)</li>
              <li>Bora Jogatina (cartas no Bora Social)</li>
              <li>Shows, Teatros e Festivais (em Porto Alegre e região)</li>
            <ul>
          </p>
          <br/>
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