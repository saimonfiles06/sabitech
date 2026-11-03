export class Charla {
	constructor({ 
        id, 
        titulo = "", 
        rama = "", 
        resContenido = "", 
        contenido = "", 
        imagen = 'XtartLogo', 
        fecha = "", 
        fechaEntrada = "", 
        duracion = "", 
        ponente = "", 
        responsable = "", 
        idSala = "" 
    }) {
		this.id = id;
		this.titulo = titulo;
		this.rama = rama;
		this.resContenido = resContenido;
		this.contenido = contenido;
		this.imagen = imagen;
        this.fecha = fecha;
        this.fechaEntrada = fechaEntrada;
        this.duracion = duracion;
        this.ponente = ponente;
        this.responsable = responsable;
        this.idSala = idSala;
	}
	
	/** Builds a User from the API JSON (extra fields are ignored). */
	static fromJSON(json) {
		return new Charla({
            id: json.id,
            titulo: json.titulo,
            rama: json.rama,
            resContenido: json.resContenido,
            contenido: json.contenido,
            imagen: json.imagen,
            fecha: json.fecha,
            fechaEntrada: json.fechaEntrada,
            duracion: json.duracion,
            ponente: json.ponente,
            responsable: json.responsable,
            idSala: json.idSala
		});
	}

	/** Plain object, to save it in sessionStorage. */
	toJSON() {
		return {
			id: this.id,
            titulo: this.titulo,
            rama: this.rama,
            resContenido: this.resContenido,
            contenido: this.contenido,
            imagen: this.imagen,
            fecha: this.fecha,
            fechaEntrada: this.fechaEntrada,
            duracion: this.duracion,
            ponente: this.ponente,
            responsable: this.responsable,
            idSala: this.idSala
		};
	}
}
