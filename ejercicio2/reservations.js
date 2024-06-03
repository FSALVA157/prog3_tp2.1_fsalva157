class Customer {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    if (typeof value === "number") {
      this._id = value;
    } else {
      throw new Error("El id del cliente debe ser un numero entero");
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (typeof value === "string") {
      this._name = value;
    } else {
      throw new Error("El nombre del cliente debe ser un string");
    }
  }

  get email() {
    return this._email;
  }

  set email(value) {
    if (typeof value === "string") {
      this._email = value;
    } else {
      throw new Error("El email debe ser un string");
    }
  }

  get info() {
    return `El nombre del cliente es: ${this.name} y su email es: ${this.email}`;
  }
} //cierre de clase Customer

class Reservation {
  constructor(id, customer, date, guests) {
    if (typeof id !== "number") {
      throw new Error("El ID debe ser un número entero");
    }
    if (!(customer instanceof Customer)) {
      throw new Error("El cliente tiene algún dato incorrecto");
    }

    if (typeof date !== "string") {
      throw new Error("La fecha debe ser una cadena de texto");
    } else {
      let dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("La fecha no tiene el formato correcto de fecha");
      } else {
        if (dateObj < new Date()) {
          throw new Error("La fecha no puede ser menor a la fecha actual");
        }
      }
    }
    if (typeof guests !== "number") {
      throw new Error("El numero de comensales debe ser un número entero");
    } else {
      if (guests < 1) {
        throw new Error("El numero de comensales debe ser mayor a 0");
      }
    }

    this.id = id;
    this.customer = customer;
    this.date = date;
    this.guests = guests;
  }

  static validateReservation(date, guests) {

    if (typeof date !== "string") {
      console.log("La fecha debe ser una cadena de texto");
      return false;
    } else {
      let dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.log("La fecha no tiene el formato correcto de fecha");
        return false;
      }else{
        if (dateObj < new Date()) {
          console.log("La fecha no puede ser menor a la fecha actual");
          return false;
        }
      }
    }
    if (typeof guests !== "number") {
      console.log("El numero de comensales debe ser un número entero");
      return false;
    }else{
      if (guests < 1) {
        console.log("El numero de comensales debe ser mayor a 0");
        return false;
      }
    }

    return true;
  } //fin de metodo validate

  get info() {    
    return  `La fecha de la reserva es: ${this.date.toLocaleString()} y el numero de comensales es: ${
        this.guests
      }`
    ;
  }
}

class Restaurant {
  constructor(name) {
    this.name = name;
    this.reservations = [];
  }

  addReservation(reservation) {
    this.reservations.push(reservation);
  }

  render() {
    const container = document.getElementById("reservations-list");
    container.innerHTML = "";
    this.reservations.forEach((reservation) => {
      const reservationCard = document.createElement("div");
      reservationCard.className = "box";
      reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                          reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
      container.appendChild(reservationCard);
    });
  }
}

document
  .getElementById("reservation-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const reservationDate = document.getElementById("reservation-date").value;
    const guests = parseInt(document.getElementById("guests").value);

    if (Reservation.validateReservation(reservationDate, guests)) {
      const customerId = restaurant.reservations.length + 1;
      const reservationId = restaurant.reservations.length + 1;

      const customer = new Customer(customerId, customerName, customerEmail);
      const reservation = new Reservation(
        reservationId,
        customer,
        reservationDate,
        guests
      );

      restaurant.addReservation(reservation);
      restaurant.render();
    } else {
      alert("Datos de reserva inválidos");
      return;
    }
  });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
  restaurant.addReservation(reservation1);
  restaurant.render();
} else {
  alert("Datos de reserva inválidos");
}

// const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
// console.log(customer1.info);

// const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);
// console.log(reservation1.info);
