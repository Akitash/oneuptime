import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    reduxForm,
    FieldArray,
    arrayPush,
    formValueSelector,

} from 'redux-form';
import {
    updateStatusPageMonitors,
    updateStatusPageMonitorsRequest,
    updateStatusPageMonitorsSuccess,
    updateStatusPageMonitorsError,
    fetchProjectStatusPage,
} from '../../actions/statusPage';
import { FormLoader } from '../basic/Loader';
import ShouldRender from '../basic/ShouldRender';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { RenderMonitors } from './RenderMonitors';
import IsAdminSubProject from '../basic/IsAdminSubProject';
import IsOwnerSubProject from '../basic/IsOwnerSubProject';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const grid: $TSFixMe = 8;

const getListStyle: Function = (isDraggingOver: $TSFixMe) => ({
    background: isDraggingOver ? 'lightblue' : 'transparent',
    padding: grid,
    width: '100%',
    height: '90%'
});

const validate: Function = (values: $TSFixMe) => {
    const errors: $TSFixMe = {};
    const { monitors = [] }: $TSFixMe = values;
    const monitorsArrayErrors: $TSFixMe = {};
    const selectedMonitor: $TSFixMe = {};
    for (let i = 0; i < monitors.length; i++) {
        const monitorErrors: $TSFixMe = {};
        const monitor: $TSFixMe = monitors[i];
        if (!monitor.monitor)

            monitorErrors.monitor = 'A monitor must be selected.';
        else {

            if (selectedMonitor[monitor.monitor])

                monitorErrors.monitor = 'This monitor is already selected.';

            selectedMonitor[monitor.monitor] = true;
        }

        monitorsArrayErrors[i] = monitorErrors;
    }

    errors.monitors = monitorsArrayErrors;
    return errors;
};

export class Monitors extends Component<ComponentProps>{
    public static displayName = '';
    public static propTypes = {};

    submitForm = (values: $TSFixMe) => {

        const { status }: $TSFixMe = this.props.statusPage;
        const { projectId }: $TSFixMe = status;
        const { monitors }: $TSFixMe = values;

        this.props

            .updateStatusPageMonitors(projectId._id || projectId, {
                _id: status._id,
                monitors,
            })
            .then(() => {

                this.props.fetchProjectStatusPage(

                    this.props.currentProject._id,
                    true,
                    0,
                    10
                );
            });
    };

    renderAddMonitorButton = (subProject: $TSFixMe) => <ShouldRender
        if={

            this.props.monitors.length > 0 &&
            (IsAdminSubProject(subProject) || IsOwnerSubProject(subProject))
        }
    >
        <button
            id="addMoreMonitors"
            className="bs-Button bs-Button--icon bs-Button--new"
            type="button"
            onClick={() =>

                this.props.pushArray('StatuspageMonitors', 'monitors', {
                    monitor: null,
                    description: '',
                    uptime: false,
                    memory: false,
                    cpu: false,
                    storage: false,
                    responseTime: false,
                    temperature: false,
                    runtime: false,
                })
            }
        >
            <span>Add Monitor</span>
        </button>
    </ShouldRender>;

    onDragEnd = (result: $TSFixMe) => {

        const { statusPageMonitors, change }: $TSFixMe = this.props;
        const { destination, source }: $TSFixMe = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start: $TSFixMe = source.droppableId;
        const finish: $TSFixMe = destination.droppableId;

        if (start === finish) {
            const result: $TSFixMe = Array.from(statusPageMonitors);
            const [removed]: $TSFixMe = result.splice(source.index, 1);
            result.splice(destination.index, 0, removed);

            change('monitors', result);

            return;
        }
    };

    override render() {

        const { handleSubmit, subProjects }: $TSFixMe = this.props;

        const { status }: $TSFixMe = this.props.statusPage;
        const subProject: $TSFixMe = !status.projectId
            ? null

            : this.props.currentProject._id === status.projectId._id ||

                this.props.currentProject._id === status.projectId

                ? this.props.currentProject
                : subProjects.filter(
                    (subProject: $TSFixMe) => subProject._id === status.projectId._id ||
                        subProject._id === status.projectId
                )[0];

        return (
            <div className="bs-ContentSection Card-root Card-shadow--medium">
                <div className="Box-root">
                    <div className="ContentHeader Box-root Box-background--white Box-divider--surface-bottom-1 Flex-flex Flex-direction--column Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-direction--row Flex-justifyContent--spaceBetween">
                            <div className="ContentHeader-center Box-root Flex-flex Flex-direction--column Flex-justifyContent--center">
                                <span className="ContentHeader-title Text-display--inline Text-fontSize--20 Text-fontWeight--regular Text-lineHeight--28 Text-typeface--base Text-wrap--wrap">
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                        Monitors
                                    </span>
                                </span>
                                <span className="ContentHeader-description Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    <span>
                                        What monitors do you want to show on the
                                        status page?
                                    </span>
                                </span>
                            </div>
                            <div className="ContentHeader-end Box-root Flex-flex Flex-alignItems--center Margin-left--16">
                                <div className="Box-root">
                                    {this.renderAddMonitorButton(subProject)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <ShouldRender
                            if={

                                this.props.monitors.length > 0 &&

                                !this.props.monitors.requesting &&

                                this.props.monitorsInForm
                            }
                        >
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <div className="bs-ContentSection-content Box-root">
                                    <div>
                                        <div className="bs-Fieldset-wrapper Box-root">
                                            <Droppable droppableId="visible_monitor">
                                                {(provided: $TSFixMe, snapshot: $TSFixMe) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver
                                                        )}
                                                        className="layoutContainer"
                                                        {...provided.droppableProps}
                                                    >
                                                        <fieldset
                                                            className="bs-Fieldset"
                                                            style={{
                                                                paddingTop:
                                                                    '0px',
                                                                backgroundColor:
                                                                    'unset',
                                                            }}
                                                        >
                                                            <FieldArray
                                                                name="monitors"
                                                                component={
                                                                    RenderMonitors
                                                                }
                                                                subProject={
                                                                    subProject
                                                                }
                                                                form="StatuspageMonitors"
                                                            />
                                                        </fieldset>
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </div>
                                </div>
                            </DragDropContext>
                        </ShouldRender>
                        <ShouldRender
                            if={

                                (!this.props.monitors.length > 0 &&

                                    !this.props.monitors.requesting) ||

                                !this.props.monitorsInForm
                            }
                        >
                            <div className="bs-ContentSection-content Box-root Box-background--offset Box-divider--surface-bottom-1 Padding-horizontal--8 Padding-vertical--2">
                                <div>
                                    <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                        <div
                                            id="app-loading"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    marginTop: '20px',
                                                    marginBottom: '20px',
                                                }}
                                            >

                                                {!this.props.monitors.length >
                                                    0 &&

                                                    !this.props.monitors
                                                        .requesting ? (
                                                    <>
                                                        No monitors are added to
                                                        this project.{' '}
                                                        <Link
                                                            to={
                                                                '/dashboard/project/' +
                                                                this.props

                                                                    .currentProject
                                                                    .slug +
                                                                '/components'
                                                            }
                                                        >
                                                            {' '}
                                                            Please create one.{' '}
                                                        </Link>
                                                    </>
                                                ) : !this.props

                                                    .monitorsInForm ? (
                                                    <>
                                                        No monitors are added to
                                                        this status page.
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ShouldRender>
                        <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                            <span className="db-SettingsForm-footerMessage"></span>
                            <div className="bs-Tail-copy">
                                <div
                                    className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                    style={{ marginTop: '10px' }}
                                >
                                    <ShouldRender
                                        if={

                                            this.props.statusPage.monitors.error
                                        }
                                    >
                                        <div className="Box-root Margin-right--8">
                                            <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                        </div>
                                        <div className="Box-root">
                                            <span style={{ color: 'red' }}>
                                                {

                                                    this.props.statusPage
                                                        .monitors.error
                                                }
                                            </span>
                                        </div>
                                    </ShouldRender>
                                </div>
                            </div>
                            <div>
                                {this.renderAddMonitorButton(subProject)}
                                <ShouldRender
                                    if={

                                        this.props.monitors.length > 0 &&
                                        (IsAdminSubProject(subProject) ||
                                            IsOwnerSubProject(subProject))
                                    }
                                >
                                    <button
                                        id="btnAddStatusPageMonitors"
                                        className="bs-Button bs-DeprecatedButton bs-Button--blue"
                                        disabled={

                                            this.props.statusPage.monitors
                                                .requesting
                                        }
                                        type="submit"
                                    >

                                        {!this.props.statusPage.monitors
                                            .requesting && (
                                                <span>Save Changes </span>
                                            )}

                                        {this.props.statusPage.monitors
                                            .requesting && <FormLoader />}
                                    </button>
                                </ShouldRender>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


Monitors.displayName = 'Monitors';


Monitors.propTypes = {
    updateStatusPageMonitors: PropTypes.func.isRequired,
    statusPage: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pushArray: PropTypes.func.isRequired,
    currentProject: PropTypes.oneOfType([
        PropTypes.object.isRequired,
        PropTypes.oneOf([null, undefined]),
    ]),
    monitors: PropTypes.array.isRequired,
    fetchProjectStatusPage: PropTypes.func.isRequired,
    subProjects: PropTypes.array.isRequired,
    monitorsInForm: PropTypes.array,
    selectedMonitors: PropTypes.array,
    statusPageMonitors: PropTypes.array,
    change: PropTypes.func,
};

const MonitorsForm: $TSFixMe = reduxForm({
    form: 'StatuspageMonitors', // a unique identifier for this form
    enableReinitialize: true,
    validate,
})(Monitors);

const mapDispatchToProps: Function = (dispatch: Dispatch) => bindActionCreators(
    {
        updateStatusPageMonitors,
        updateStatusPageMonitorsRequest,
        updateStatusPageMonitorsSuccess,
        updateStatusPageMonitorsError,
        fetchProjectStatusPage,
        pushArray: arrayPush,
    },
    dispatch
);

const selector: $TSFixMe = formValueSelector('StatuspageMonitors');

const mapStateToProps: Function = (state: RootState, ownProps: $TSFixMe) => {
    const { subProjectId }: $TSFixMe = ownProps;
    const { currentProject }: $TSFixMe = state.project;

    const monitors: $TSFixMe = state.monitor.monitorsList.monitors
        .filter((monitor: $TSFixMe) => String(monitor._id) === String(subProjectId))
        .map((monitor: $TSFixMe) => monitor.monitors)
        .flat();
    const {
        statusPage,
        statusPage: {
            status: { monitors: selectedMonitors },
        },
    } = state;
    const initialValues: $TSFixMe = { monitors: selectedMonitors || [] };
    //Description field rendering becomes slow if the array is assigned to monitorsInForm instead of the array's lenght.
    const monitorsInForm: $TSFixMe =
        selector(state, 'monitors') && selector(state, 'monitors').length;
    const subProjects: $TSFixMe = state.subProject.subProjects.subProjects;

    return {
        initialValues,
        monitors,
        statusPage,
        currentProject,
        subProjects,
        monitorsInForm,
        selectedMonitors,
        statusPageMonitors:
            state.form.StatuspageMonitors &&
            state.form.StatuspageMonitors.values &&
            state.form.StatuspageMonitors.values.monitors,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MonitorsForm);