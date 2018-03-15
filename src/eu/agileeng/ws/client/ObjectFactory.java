
package eu.agileeng.ws.client;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the eu.agileeng.ws.client package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _ServiceSubscribeResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "ServiceSubscribeResponse");
    private final static QName _GetServiceSubscribedResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "GetServiceSubscribedResponse");
    private final static QName _ServiceSubscribe_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "ServiceSubscribe");
    private final static QName _GetServiceList_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "GetServiceList");
    private final static QName _ServiceUnsubscribe_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "ServiceUnsubscribe");
    private final static QName _GetServiceListResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "GetServiceListResponse");
    private final static QName _FaultBean_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "FaultBean");
    private final static QName _PutServiceSubscribe_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "PutServiceSubscribe");
    private final static QName _PutServiceSubscribeResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "PutServiceSubscribeResponse");
    private final static QName _GetServiceSubscribed_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "GetServiceSubscribed");
    private final static QName _UploadNotificationResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "UploadNotificationResponse");
    private final static QName _FunctionalFault_QNAME = new QName("http://service.dematbox.frontal.dematbox.sagemcom.com/", "FunctionalFault");
    private final static QName _ServiceUnsubscribeResponse_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "ServiceUnsubscribeResponse");
    private final static QName _UploadNotification_QNAME = new QName("http://service.frontal.dematbox.sagemcom.com/", "UploadNotification");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: eu.agileeng.ws.client
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link ServiceListBean }
     * 
     */
    public ServiceListBean createServiceListBean() {
        return new ServiceListBean();
    }

    /**
     * Create an instance of {@link SubscribedListBean }
     * 
     */
    public SubscribedListBean createSubscribedListBean() {
        return new SubscribedListBean();
    }

    /**
     * Create an instance of {@link ServiceUnsubscribeResponse }
     * 
     */
    public ServiceUnsubscribeResponse createServiceUnsubscribeResponse() {
        return new ServiceUnsubscribeResponse();
    }

    /**
     * Create an instance of {@link ServicesBean }
     * 
     */
    public ServicesBean createServicesBean() {
        return new ServicesBean();
    }

    /**
     * Create an instance of {@link ServiceSubscribeResponse }
     * 
     */
    public ServiceSubscribeResponse createServiceSubscribeResponse() {
        return new ServiceSubscribeResponse();
    }

    /**
     * Create an instance of {@link PutServiceSubscribeResponse }
     * 
     */
    public PutServiceSubscribeResponse createPutServiceSubscribeResponse() {
        return new PutServiceSubscribeResponse();
    }

    /**
     * Create an instance of {@link GetServiceList }
     * 
     */
    public GetServiceList createGetServiceList() {
        return new GetServiceList();
    }

    /**
     * Create an instance of {@link ComSagemcomDematboxFrontalDematboxServiceFaultBean }
     * 
     */
    public ComSagemcomDematboxFrontalDematboxServiceFaultBean createComSagemcomDematboxFrontalDematboxServiceFaultBean() {
        return new ComSagemcomDematboxFrontalDematboxServiceFaultBean();
    }

    /**
     * Create an instance of {@link GetServiceSubscribedResponse }
     * 
     */
    public GetServiceSubscribedResponse createGetServiceSubscribedResponse() {
        return new GetServiceSubscribedResponse();
    }

    /**
     * Create an instance of {@link ListServiceGroupsBean }
     * 
     */
    public ListServiceGroupsBean createListServiceGroupsBean() {
        return new ListServiceGroupsBean();
    }

    /**
     * Create an instance of {@link ServiceDTO }
     * 
     */
    public ServiceDTO createServiceDTO() {
        return new ServiceDTO();
    }

    /**
     * Create an instance of {@link ServiceUnsubscribe }
     * 
     */
    public ServiceUnsubscribe createServiceUnsubscribe() {
        return new ServiceUnsubscribe();
    }

    /**
     * Create an instance of {@link GetServiceListResponse }
     * 
     */
    public GetServiceListResponse createGetServiceListResponse() {
        return new GetServiceListResponse();
    }

    /**
     * Create an instance of {@link OperatorAuthBean }
     * 
     */
    public OperatorAuthBean createOperatorAuthBean() {
        return new OperatorAuthBean();
    }

    /**
     * Create an instance of {@link Service }
     * 
     */
    public Service createService() {
        return new Service();
    }

    /**
     * Create an instance of {@link GetServiceSubscribed }
     * 
     */
    public GetServiceSubscribed createGetServiceSubscribed() {
        return new GetServiceSubscribed();
    }

    /**
     * Create an instance of {@link ServiceGroupDTO }
     * 
     */
    public ServiceGroupDTO createServiceGroupDTO() {
        return new ServiceGroupDTO();
    }

    /**
     * Create an instance of {@link PutServiceSubscribe }
     * 
     */
    public PutServiceSubscribe createPutServiceSubscribe() {
        return new PutServiceSubscribe();
    }

    /**
     * Create an instance of {@link UploadNotificationResponse }
     * 
     */
    public UploadNotificationResponse createUploadNotificationResponse() {
        return new UploadNotificationResponse();
    }

    /**
     * Create an instance of {@link UploadNotification }
     * 
     */
    public UploadNotification createUploadNotification() {
        return new UploadNotification();
    }

    /**
     * Create an instance of {@link ServiceSubscribe }
     * 
     */
    public ServiceSubscribe createServiceSubscribe() {
        return new ServiceSubscribe();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ServiceSubscribeResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "ServiceSubscribeResponse")
    public JAXBElement<ServiceSubscribeResponse> createServiceSubscribeResponse(ServiceSubscribeResponse value) {
        return new JAXBElement<ServiceSubscribeResponse>(_ServiceSubscribeResponse_QNAME, ServiceSubscribeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetServiceSubscribedResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "GetServiceSubscribedResponse")
    public JAXBElement<GetServiceSubscribedResponse> createGetServiceSubscribedResponse(GetServiceSubscribedResponse value) {
        return new JAXBElement<GetServiceSubscribedResponse>(_GetServiceSubscribedResponse_QNAME, GetServiceSubscribedResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ServiceSubscribe }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "ServiceSubscribe")
    public JAXBElement<ServiceSubscribe> createServiceSubscribe(ServiceSubscribe value) {
        return new JAXBElement<ServiceSubscribe>(_ServiceSubscribe_QNAME, ServiceSubscribe.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetServiceList }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "GetServiceList")
    public JAXBElement<GetServiceList> createGetServiceList(GetServiceList value) {
        return new JAXBElement<GetServiceList>(_GetServiceList_QNAME, GetServiceList.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ServiceUnsubscribe }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "ServiceUnsubscribe")
    public JAXBElement<ServiceUnsubscribe> createServiceUnsubscribe(ServiceUnsubscribe value) {
        return new JAXBElement<ServiceUnsubscribe>(_ServiceUnsubscribe_QNAME, ServiceUnsubscribe.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetServiceListResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "GetServiceListResponse")
    public JAXBElement<GetServiceListResponse> createGetServiceListResponse(GetServiceListResponse value) {
        return new JAXBElement<GetServiceListResponse>(_GetServiceListResponse_QNAME, GetServiceListResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ComSagemcomDematboxFrontalDematboxServiceFaultBean }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "FaultBean")
    public JAXBElement<ComSagemcomDematboxFrontalDematboxServiceFaultBean> createFaultBean(ComSagemcomDematboxFrontalDematboxServiceFaultBean value) {
        return new JAXBElement<ComSagemcomDematboxFrontalDematboxServiceFaultBean>(_FaultBean_QNAME, ComSagemcomDematboxFrontalDematboxServiceFaultBean.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PutServiceSubscribe }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "PutServiceSubscribe")
    public JAXBElement<PutServiceSubscribe> createPutServiceSubscribe(PutServiceSubscribe value) {
        return new JAXBElement<PutServiceSubscribe>(_PutServiceSubscribe_QNAME, PutServiceSubscribe.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PutServiceSubscribeResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "PutServiceSubscribeResponse")
    public JAXBElement<PutServiceSubscribeResponse> createPutServiceSubscribeResponse(PutServiceSubscribeResponse value) {
        return new JAXBElement<PutServiceSubscribeResponse>(_PutServiceSubscribeResponse_QNAME, PutServiceSubscribeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetServiceSubscribed }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "GetServiceSubscribed")
    public JAXBElement<GetServiceSubscribed> createGetServiceSubscribed(GetServiceSubscribed value) {
        return new JAXBElement<GetServiceSubscribed>(_GetServiceSubscribed_QNAME, GetServiceSubscribed.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link UploadNotificationResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "UploadNotificationResponse")
    public JAXBElement<UploadNotificationResponse> createUploadNotificationResponse(UploadNotificationResponse value) {
        return new JAXBElement<UploadNotificationResponse>(_UploadNotificationResponse_QNAME, UploadNotificationResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ComSagemcomDematboxFrontalDematboxServiceFaultBean }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.dematbox.frontal.dematbox.sagemcom.com/", name = "FunctionalFault")
    public JAXBElement<ComSagemcomDematboxFrontalDematboxServiceFaultBean> createFunctionalFault(ComSagemcomDematboxFrontalDematboxServiceFaultBean value) {
        return new JAXBElement<ComSagemcomDematboxFrontalDematboxServiceFaultBean>(_FunctionalFault_QNAME, ComSagemcomDematboxFrontalDematboxServiceFaultBean.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ServiceUnsubscribeResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "ServiceUnsubscribeResponse")
    public JAXBElement<ServiceUnsubscribeResponse> createServiceUnsubscribeResponse(ServiceUnsubscribeResponse value) {
        return new JAXBElement<ServiceUnsubscribeResponse>(_ServiceUnsubscribeResponse_QNAME, ServiceUnsubscribeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link UploadNotification }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.frontal.dematbox.sagemcom.com/", name = "UploadNotification")
    public JAXBElement<UploadNotification> createUploadNotification(UploadNotification value) {
        return new JAXBElement<UploadNotification>(_UploadNotification_QNAME, UploadNotification.class, null, value);
    }

}
