
package eu.agileeng.ws.operator;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the eu.agileeng.ws.operator package. 
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

    private final static QName _SendFileResponse_QNAME = new QName("http://service.operator.dematbox.sagemcom.com/", "SendFileResponse");
    private final static QName _PingOperatorResponse_QNAME = new QName("http://service.operator.dematbox.sagemcom.com/", "PingOperatorResponse");
    private final static QName _SendFile_QNAME = new QName("http://service.operator.dematbox.sagemcom.com/", "SendFile");
    private final static QName _PingOperator_QNAME = new QName("http://service.operator.dematbox.sagemcom.com/", "PingOperator");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: eu.agileeng.ws.operator
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link PingOperator }
     * 
     */
    public PingOperator createPingOperator() {
        return new PingOperator();
    }

    /**
     * Create an instance of {@link SendFile }
     * 
     */
    public SendFile createSendFile() {
        return new SendFile();
    }

    /**
     * Create an instance of {@link PingOperatorResponse }
     * 
     */
    public PingOperatorResponse createPingOperatorResponse() {
        return new PingOperatorResponse();
    }

    /**
     * Create an instance of {@link SendFileResponse }
     * 
     */
    public SendFileResponse createSendFileResponse() {
        return new SendFileResponse();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link SendFileResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.operator.dematbox.sagemcom.com/", name = "SendFileResponse")
    public JAXBElement<SendFileResponse> createSendFileResponse(SendFileResponse value) {
        return new JAXBElement<SendFileResponse>(_SendFileResponse_QNAME, SendFileResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PingOperatorResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.operator.dematbox.sagemcom.com/", name = "PingOperatorResponse")
    public JAXBElement<PingOperatorResponse> createPingOperatorResponse(PingOperatorResponse value) {
        return new JAXBElement<PingOperatorResponse>(_PingOperatorResponse_QNAME, PingOperatorResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link SendFile }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.operator.dematbox.sagemcom.com/", name = "SendFile")
    public JAXBElement<SendFile> createSendFile(SendFile value) {
        return new JAXBElement<SendFile>(_SendFile_QNAME, SendFile.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link PingOperator }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://service.operator.dematbox.sagemcom.com/", name = "PingOperator")
    public JAXBElement<PingOperator> createPingOperator(PingOperator value) {
        return new JAXBElement<PingOperator>(_PingOperator_QNAME, PingOperator.class, null, value);
    }

}
