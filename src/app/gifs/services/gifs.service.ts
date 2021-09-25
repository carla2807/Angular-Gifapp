import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'XUtetaP6NAmdlMMXjtH2M24ZTxLcYLE6';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _historial: string[] = [];

  public resultados: Gif[] = [];

  //2° metodo get que me regrese arreglo _historial
  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  //3° funcion para buscar gifs
  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query); //Lo inserta
      this._historial = this._historial.splice(0, 10); //Corta el arreglo principal
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp: any) => {
        console.log(resp.data);
        this.resultados = resp.data;

        localStorage.setItem('resultados', JSON.stringify(this.resultados)); //Guardo imagenes
      });
  }
}
