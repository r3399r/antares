import { Container } from 'inversify';
import 'reflect-metadata';
import { InstantService } from './logic/InstantService';

const container: Container = new Container();
// service
container.bind<InstantService>(InstantService).toSelf();

export { container as bindings };
