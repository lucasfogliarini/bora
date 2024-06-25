import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { BoraApiService } from '../bora-api.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent {
  @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;
  markers: Marker[] = [];
  poa: google.maps.LatLngLiteral = { lat: -30.0346, lng: -51.2177 };// Coordenadas para Porto Alegre, Brasil
  boraWork: google.maps.LatLngLiteral = { lat: -30.0540572, lng: -51.1477079 };// Coordenadas para Porto Alegre, Brasil
  center: google.maps.LatLngLiteral = this.boraWork;

  mapOptions: google.maps.MapOptions = {
    center: this.boraWork,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    disableDefaultUI: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: true,
    zoomControl: false,
  };

  constructor(private boraApiService: BoraApiService) { }
  ngAfterViewInit(): void {
    if(this.googleMap){
      var placesService = new google.maps.places.PlacesService(this.googleMap.googleMap!);
      var request = {
          query: 'bora.work, Porto Alegre, Brazil',
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
    const calendarAuthorized = true;
    this.boraApiService.getPartners(calendarAuthorized, (partners=>{
      if(partners){
        const partnersNotDirectors = partners.filter(p=>p.username != 'bora.work' && p.username != 'lucasfogliarini');
        const featuredPartner = partnersNotDirectors.length ? partnersNotDirectors[0] : partners[1];
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h5 class='text-center'>Bora.Work</h5>
              <h6 class='text-center'>Consultoria e Parcerias</h6>
              <br/>
              <nav class="text-center">
                <a class='btn btn-dark' href="/bora.work">Consultoria de TI</a>
                <a class='btn btn-white btn-outline-secondary' href="${featuredPartner.username}">
                  ${featuredPartner.name} <small style='font-size: xx-small'>(${featuredPartner.accountability})</small>
                </a>
              </nav>
              <br/>
              <p>
                <b>bora.work</b> é uma plataforma de <b><a target='_blank' href='/bora.work'>Consultoria de TI</a></b> e <b>Parcerias</b> que facilita o <b>entendimento</b>, <b>arquitetura</b>, <b>desenvolvimento</b> e <b>testes</b> de <b>projetos inovadores de tecnologia</b> com <b>qualidade</b>, além de tudo isso, também <b>realiza</b> diversos <b><a target='_blank' href='/bora.work'>encontros</a></b>, incluindo <b><a target='_blank' href='/bora.work?find=tech'>encontros de tecnologia (Bora Tech)</a>, palestras, workshops, cursos e o <a target='_blank' href='/bora.work?find=Bora Parceiros'>Bora Parceiros!</a></b> para <b>expandir o networking</b> e <b>discutir gestão e liderança</b>.
                <br/>
                Atuamos em diversos locais, como <b>coworkings, casas, restaurantes e plataformas digitais (Google Meet, Discord e WhatsApp)</b>. Proporcionamos <b>experiências únicas</b> que <b>conectam pessoas</b>, promovendo o crescimento <b>profissional</b> e a <b>expansão</b> da rede de contatos em ambientes acolhedores e confortáveis. Junte-se a nós e descubra como <b>transformar suas ideias em realidade.</b>
              </p>
              <div class='text-center'>
                <small>A maioria dos encontros presenciais são em Porto Alegre no</small>
                <br />
                <br />
                <a class='btn btn-white btn-outline-secondary' target='_blank' href='https://www.google.com/maps/search/?api=1&query=bora.work, Porto Alegre'>Bora Work!</a>
                <br />
                ⬇️
              </div>
              <br/>
            </div>
          `
        });
        infoWindow.open(this.googleMap.googleMap, marker);
      }
    }));
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