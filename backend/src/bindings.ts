import { Container } from 'inversify';
import 'reflect-metadata';
import { DbAccess } from './access/DbAccess';
import { InstantAccess } from './access/InstantAccess';
import { StructureAccess } from './access/StructureAccess';
import { InstantService } from './logic/InstantService';
import { InstantEntity } from './model/entity/InstantEntity';
import { StructureEntity } from './model/entity/StructureEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(InstantEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(StructureEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<InstantAccess>(InstantAccess).toSelf();
container.bind<StructureAccess>(StructureAccess).toSelf();

// service
container.bind<InstantService>(InstantService).toSelf();

export { container as bindings };
