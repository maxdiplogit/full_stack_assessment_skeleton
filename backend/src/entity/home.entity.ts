import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Home {
    @PrimaryGeneratedColumn()
    home_id: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    street_address: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    zip: string;

    @Column({ type: 'float', nullable: true })
    sqft: number;

    @Column({ type: 'int', nullable: true })
    beds: string;

    @Column({ type: 'int', nullable: true })
    baths: string;

    @Column({ type: 'float', nullable: true })
    list_price: number;
}


